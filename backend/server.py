from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Munchy's Grill API")
api_router = APIRouter(prefix="/api")


# ----- Models -----
class CartItemOption(BaseModel):
    group: str
    value: str

class CartItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int = 1
    options: List[CartItemOption] = []
    instructions: Optional[str] = None
    image: Optional[str] = None

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    pickup_time: str  # 'asap' or ISO string
    notes: Optional[str] = None
    items: List[CartItem]
    subtotal: float
    tax: float
    surcharge: float
    total: float
    payment_method: Literal['toast_handoff', 'cash_on_pickup'] = 'toast_handoff'

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_phone: str
    pickup_time: str
    notes: Optional[str] = None
    items: List[CartItem]
    subtotal: float
    tax: float
    surcharge: float
    total: float
    payment_method: str
    status: Literal['pending', 'preparing', 'ready', 'completed', 'cancelled'] = 'pending'
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class OrderStatusUpdate(BaseModel):
    status: Literal['pending', 'preparing', 'ready', 'completed', 'cancelled']

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ----- Routes -----
@api_router.get("/")
async def root():
    return {"message": "Munchy's Grill API", "status": "ok"}

@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    order = Order(**payload.model_dump())
    doc = order.model_dump()
    await db.orders.insert_one(doc)
    return order

@api_router.get("/orders", response_model=List[Order])
async def list_orders():
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return orders

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@api_router.patch("/orders/{order_id}", response_model=Order)
async def update_order_status(order_id: str, payload: OrderStatusUpdate):
    result = await db.orders.find_one_and_update(
        {"id": order_id},
        {"$set": {"status": payload.status}},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    return result

@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    contact = Contact(**payload.model_dump())
    await db.contacts.insert_one(contact.model_dump())
    return contact

@api_router.get("/contact", response_model=List[Contact])
async def list_contacts():
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return contacts


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
