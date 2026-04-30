import os
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load REACT_APP_BACKEND_URL from frontend/.env
load_dotenv(Path(__file__).resolve().parents[2] / 'frontend' / '.env')
BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/')


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
def test_root_ok(api):
    r = api.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"
    assert "Munchy" in data.get("message", "")


# ---------- Orders ----------
def _sample_order_payload():
    return {
        "customer_name": "TEST Jane Doe",
        "customer_phone": "555-555-0101",
        "pickup_time": "asap",
        "notes": "TEST order",
        "items": [{
            "id": "shnitzel-baguette",
            "name": "Shnitzel Baguette",
            "price": 17.50,
            "quantity": 2,
            "options": [
                {"group": "baguette_toppings", "value": "Lettuce"},
                {"group": "baguette_sauces", "value": "Garlic Aioli"}
            ],
            "instructions": "extra crispy",
            "image": "https://example.com/x.jpg"
        }],
        "subtotal": 35.00,
        "tax": 3.10,
        "surcharge": 1.00,
        "total": 39.10,
        "payment_method": "cash_on_pickup",
    }


@pytest.fixture(scope="session")
def created_order(api):
    r = api.post(f"{BASE_URL}/api/orders", json=_sample_order_payload())
    assert r.status_code == 200, r.text
    o = r.json()
    assert "_id" not in o
    assert o["customer_name"] == "TEST Jane Doe"
    assert o["status"] == "pending"
    assert o["total"] == 39.10
    assert isinstance(o["id"], str) and len(o["id"]) > 0
    assert len(o["items"]) == 1
    assert o["items"][0]["options"][0]["group"] == "baguette_toppings"
    return o


def test_create_order_persistence(api, created_order):
    oid = created_order["id"]
    r = api.get(f"{BASE_URL}/api/orders/{oid}")
    assert r.status_code == 200
    got = r.json()
    assert got["id"] == oid
    assert got["customer_phone"] == "555-555-0101"
    assert "_id" not in got


def test_create_order_empty_cart_rejected(api):
    p = _sample_order_payload()
    p["items"] = []
    r = api.post(f"{BASE_URL}/api/orders", json=p)
    assert r.status_code == 400
    assert "empty" in r.json().get("detail", "").lower()


def test_list_orders_sorted_desc(api, created_order):
    r = api.get(f"{BASE_URL}/api/orders")
    assert r.status_code == 200
    orders = r.json()
    assert isinstance(orders, list) and len(orders) >= 1
    # sorted desc by created_at
    times = [o["created_at"] for o in orders]
    assert times == sorted(times, reverse=True)
    # created order present
    assert any(o["id"] == created_order["id"] for o in orders)
    # no _id leak
    for o in orders[:5]:
        assert "_id" not in o


def test_get_order_unknown_returns_404(api):
    r = api.get(f"{BASE_URL}/api/orders/does-not-exist-xyz")
    assert r.status_code == 404


def test_patch_order_status_transitions(api, created_order):
    oid = created_order["id"]
    for status in ("preparing", "ready", "completed"):
        r = api.patch(f"{BASE_URL}/api/orders/{oid}", json={"status": status})
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["status"] == status
        assert "_id" not in body
        # verify persisted
        g = api.get(f"{BASE_URL}/api/orders/{oid}").json()
        assert g["status"] == status


def test_patch_order_invalid_status(api, created_order):
    oid = created_order["id"]
    r = api.patch(f"{BASE_URL}/api/orders/{oid}", json={"status": "bogus"})
    assert r.status_code == 422


def test_patch_order_unknown_id(api):
    r = api.patch(f"{BASE_URL}/api/orders/nope-nope", json={"status": "preparing"})
    assert r.status_code == 404


# ---------- Contact ----------
def test_contact_create_valid(api):
    payload = {"name": "TEST Contact", "email": "test.contact@example.com", "message": "Hello Munchy"}
    r = api.post(f"{BASE_URL}/api/contact", json=payload)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == payload["email"]
    assert body["name"] == payload["name"]
    assert "_id" not in body
    assert isinstance(body["id"], str)


def test_contact_create_invalid_email(api):
    r = api.post(f"{BASE_URL}/api/contact", json={"name": "X", "email": "not-an-email", "message": "m"})
    assert r.status_code == 422


def test_contact_list(api):
    r = api.get(f"{BASE_URL}/api/contact")
    assert r.status_code == 200
    lst = r.json()
    assert isinstance(lst, list)
    assert any(c.get("email") == "test.contact@example.com" for c in lst)
    for c in lst[:5]:
        assert "_id" not in c
