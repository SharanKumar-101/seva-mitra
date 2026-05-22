import os, shutil, uuid, datetime
import razorpay # NEW: Razorpay library
from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from contextlib import contextmanager
from twilio.rest import Client
from fastapi.responses import FileResponse

# --- 1. Setup & Folders ---
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- 2. Twilio Configuration ---
account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
twilio_number = os.environ.get("TWILIO_PHONE_NUMBER") 
client = Client(account_sid, auth_token) if account_sid and auth_token else None

# --- 2.5 Razorpay Configuration ---
RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET")
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    rzp_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
else:
    rzp_client = None

# --- 3. DB Context Manager ---
@contextmanager
def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

# --- 4. Database Models ---
class Provider(Base):
    __tablename__ = "providers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    phone = Column(String)
    location = Column(String)
    photo_url = Column(String)
    experience = Column(Integer)
    rating = Column(String)
    base_price = Column(Integer)

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    customer_phone = Column(String)
    provider_id = Column(Integer)
    status = Column(String, default="Confirmed")
    created_at = Column(DateTime, default=datetime.datetime.now)
    cancel_reason = Column(String, nullable=True)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer)
    rating = Column(Integer)
    feedback = Column(String)

Base.metadata.create_all(bind=engine)

# --- 5. FastAPI App Initialization ---
app = FastAPI(title="Sevamitra API v2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")
BASE_URL = "https://seva-mitra.onrender.com"

def resolve_photo(p: Provider):
    url = p.photo_url or ""
    return f"{BASE_URL}{url}" if url.startswith("/static/") else url

# --- 6. Endpoints ---
@app.post("/create-order/")
def create_order(data: dict):
    amount = data.get("amount", 50) * 100 # Razorpay requires paise (50 rupees = 5000 paise)
    if not rzp_client:
        raise HTTPException(status_code=500, detail="Razorpay not configured on server.")
    try:
        order_data = {"amount": amount, "currency": "INR", "payment_capture": "1"}
        order = rzp_client.order.create(data=order_data)
        return {"order_id": order["id"], "amount": amount, "currency": "INR"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/initiate-call/")
def initiate_call(data: dict):
    customer_phone = data.get("customer_phone")
    provider_phone = data.get("provider_phone")
    if not customer_phone or not provider_phone:
        raise HTTPException(status_code=400, detail="Missing phone numbers")
    try:
        if client:
            call = client.calls.create(
                to=customer_phone,
                from_=twilio_number,
                twiml=f'<Response><Say>Connecting you to Sevamitra Professional.</Say><Dial>{provider_phone}</Dial></Response>'
            )
            return {"msg": "Call initiated", "sid": call.sid}
        else:
            return {"msg": "Twilio not configured properly."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/providers/")
def get_providers():
    with get_db() as db:
        data = db.query(Provider).all()
        return [{"id": p.id, "name": p.name, "category": p.category, "phone": p.phone, "location": p.location, "photo_url": resolve_photo(p), "experience": p.experience, "rating": p.rating, "base_price": p.base_price} for p in data]

@app.post("/providers/")
def create_provider(name: str = Form(...), category: str = Form(...), phone: str = Form(...), location: str = Form(...), experience: int = Form(...), rating: str = Form(...), base_price: int = Form(...), photo_url: str = Form(None)):
    with get_db() as db:
        db.add(Provider(name=name, category=category, phone=phone, location=location, photo_url=photo_url, experience=experience, rating=rating, base_price=base_price))
    return {"msg": "Provider created"}

@app.put("/providers/{provider_id}")
def update_provider(provider_id: int, name: str = Form(...), category: str = Form(...), phone: str = Form(...), location: str = Form(...), experience: int = Form(...), rating: str = Form(...), base_price: int = Form(...), photo_url: str = Form(None)):
    with get_db() as db:
        provider = db.query(Provider).filter(Provider.id == provider_id).first()
        if not provider: raise HTTPException(status_code=404, detail="Provider not found")
        provider.name, provider.category, provider.phone = name, category, phone
        provider.location, provider.experience, provider.rating = location, experience, rating
        provider.base_price = base_price
        if photo_url: provider.photo_url = photo_url
    return {"msg": "Provider updated"}

@app.delete("/providers/{provider_id}")
def delete_provider(provider_id: int):
    with get_db() as db:
        provider = db.query(Provider).filter(Provider.id == provider_id).first()
        if not provider: raise HTTPException(status_code=404, detail="Provider not found")
        db.delete(provider)
    return {"msg": "Provider deleted"}

@app.get("/bookings/")
def get_bookings():
    with get_db() as db:
        results = db.query(Booking, Provider).outerjoin(Provider, Booking.provider_id == Provider.id).all()
        return [{"id": b.id, "customer_name": b.customer_name, "customer_phone": b.customer_phone, "worker_name": p.name if p else "Unknown", "category": p.category if p else "Service", "time": b.created_at.isoformat(), "status": b.status, "cancel_reason": b.cancel_reason, "provider_id": b.provider_id} for b, p in results]

@app.post("/bookings/")
def make_booking(data: dict):
    with get_db() as db:
        db.add(Booking(customer_name=data.get("customer_name", ""), customer_phone=data.get("customer_phone", ""), provider_id=data.get("provider_id")))
    return {"msg": "Booking confirmed"}

@app.put("/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: int, reason_data: dict):
    with get_db() as db:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking: raise HTTPException(status_code=404, detail="Booking not found")
        booking.status = "Cancelled"
        booking.cancel_reason = reason_data.get("reason", "Not specified")
    return {"msg": "Booking cancelled"}

@app.put("/bookings/{booking_id}/complete")
def complete_booking(booking_id: int):
    with get_db() as db:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking: raise HTTPException(status_code=404, detail="Booking not found")
        booking.status = "Completed"
    return {"msg": "Booking successfully marked as Completed"}

@app.post("/reviews/")
def submit_review(data: dict):
    with get_db() as db:
        db.add(Review(provider_id=data.get("provider_id"), rating=data.get("rating"), feedback=data.get("feedback", "")))
    return {"msg": "Review submitted successfully"}

# --- 7. SERVE FRONTEND ---
DIST_DIR = os.path.join(os.getcwd(), "nyra-frontend", "dist")
if os.path.exists(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        return FileResponse(os.path.join(DIST_DIR, "index.html"))
