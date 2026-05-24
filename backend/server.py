from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal, Any
import uuid
from datetime import datetime, timezone
import json


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Load menu data from the frontend
MENU_DATA_PATH = Path(__file__).parent.parent / "frontend" / "src" / "data" / "menu.js"

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Munchy's Grill API")
api_router = APIRouter(prefix="/api")


# ----- Menu Data (Toast API Format) -----
RESTAURANT_INFO = {
    "name": "Munchy's Grill",
    "tagline": "If you ain't here, you ain't munching.",
    "address": "12 Irving Place, Woodmere, NY 11598",
    "phone": "(516) 595-3500",
    "toastUrl": "https://order.toasttab.com/online/munchy-s-grill-12-irving-place",
    "logo": "https://www.munchysgrillny.com/assets/logo2-f258ddec.png",
    "banner": "https://d2s742iet3d3t1.cloudfront.net/restaurant_service/restaurants/f48bb435-8bb1-45da-ad92-89dba53dd37b/Restaurant/d20713ba-0a50-4a65-bfea-de6af22f8ea6.jpg",
}

CATEGORIES = [
    {"id": "starters", "name": "Starters", "tagline": "Small plates, big flavor.", "hex": "#F8C42E"},
    {"id": "burgers", "name": "Burgers", "tagline": "Hand-formed. Charcoal-grilled.", "hex": "#D9462A"},
    {"id": "baguettes", "name": "Baguette Sandwiches", "tagline": "House baguette. Loaded.", "hex": "#C72D3C"},
    {"id": "shawarma", "name": "Shawarma & Falafel", "tagline": "Off the spit, into pita.", "hex": "#D97552"},
    {"id": "wraps", "name": "Wraps", "tagline": "Built to go.", "hex": "#C39046"},
    {"id": "salads", "name": "Salads", "tagline": "Lighter side of the menu.", "hex": "#7C926A"},
    {"id": "platters", "name": "Platters", "tagline": "For the table.", "hex": "#6E4988"},
    {"id": "sides", "name": "Sides", "tagline": "Fries, hummus, the rest.", "hex": "#388A85"},
]

# Simplified menu items (full menu from frontend menu.js)
MENU_ITEMS = [
    {"id": "popcorn-chicken", "category": "starters", "name": "Popcorn Chicken", "description": "Bite-size crispy chicken, twice-marinated, golden-fried.", "price": 12.95, "image": "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=1200", "options": ["spice_level"], "featured": False},
    {"id": "wings-bbq", "category": "starters", "name": "BBQ Wings", "description": "Eight pieces, slow-glazed in house BBQ.", "price": 14.50, "image": "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=1200", "options": ["spice_level"]},
    {"id": "poppers", "category": "starters", "name": "Jalapeño Poppers", "description": "Six pieces, breaded, served with chipotle aioli.", "price": 11.50, "image": "https://images.unsplash.com/photo-1579888944884-c7fc5a553848?auto=format&fit=crop&q=80&w=1200"},
    {"id": "classic-burger", "category": "burgers", "name": "Classic Burger", "description": "8 oz hand-formed beef. Toasted bun. Pick your toppings.", "price": 17.50, "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1200", "options": ["burger_temp", "baguette_toppings", "baguette_sauces"], "featured": True},
    {"id": "cheese-burger", "category": "burgers", "name": "Cheese Burger", "description": "8 oz with melted American cheese.", "price": 19.50, "image": "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&q=80&w=1200", "options": ["burger_temp", "baguette_toppings", "baguette_sauces"]},
    {"id": "shnitzel-baguette", "category": "baguettes", "name": "Schnitzel Baguette", "description": "Two crispy schnitzel pieces on a fresh baguette. Pick your toppings, up to two sauces.", "price": 17.50, "image": "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&q=80&w=1400", "options": ["baguette_toppings", "baguette_sauces"], "featured": True},
    {"id": "fsu-schnitzel", "category": "baguettes", "name": "FSU Schnitzel", "description": "8-inch baguette. Two golden schnitzel pieces. Loaded.", "price": 26.32, "image": "https://images.unsplash.com/photo-1619221882161-95d3ddd5fe9d?auto=format&fit=crop&q=80&w=1400", "options": ["baguette_toppings", "baguette_sauces"], "featured": True},
    {"id": "chicken-shawarma", "category": "shawarma", "name": "Chicken Shawarma", "description": "Pita or laffa. Shaved off the spit. Tahini and amba.", "price": 21.84, "image": "https://images.pexels.com/photos/29850814/pexels-photo-29850814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200", "options": ["baguette_toppings", "baguette_sauces"], "featured": True},
    {"id": "falafel-pita", "category": "shawarma", "name": "Falafel Pita", "description": "Five hand-rolled falafel. Crisp shell, herbed center.", "price": 14.50, "image": "https://images.pexels.com/photos/2373536/pexels-photo-2373536.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200", "options": ["baguette_toppings", "baguette_sauces"]},
    {"id": "schnitzel-wrap", "category": "wraps", "name": "Schnitzel Wrap", "description": "Crispy schnitzel, lettuce, tomato, garlic aioli, in a flour wrap.", "price": 17.50, "image": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=1200", "options": ["baguette_toppings", "baguette_sauces"]},
    {"id": "garden-salad", "category": "salads", "name": "Garden Salad", "description": "Mixed greens, tomato, cucumber, red onion, house vinaigrette.", "price": 12.50, "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200"},
    {"id": "shawarma-platter", "category": "platters", "name": "Chicken Shawarma Platter", "description": "Shawarma, rice, hummus, Israeli salad, pita.", "price": 26.50, "image": "https://images.unsplash.com/photo-1542528180-1c2803c5f956?auto=format&fit=crop&q=80&w=1200", "featured": True},
    {"id": "fries", "category": "sides", "name": "French Fries", "description": "Hand-cut, double-fried.", "price": 6.50, "image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=1200"},
]

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

@api_router.get("/menu")
async def get_menu():
    """Returns menu data in Toast API format"""
    return {
        "restaurant": RESTAURANT_INFO,
        "categories": CATEGORIES,
        "items": MENU_ITEMS,
    }

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
