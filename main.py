import os, shutil, uuid, datetime
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from contextlib import contextmanager
from twilio.rest import Client
from fastapi.responses import FileResponse  # <-- ADDED FOR FRONTEND

# --- 1. Setup & Folders ---
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

SQLALCHEMY_DATABASE_URL = "sqlite:///./nyra_database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- 2. Twilio Configuration ---
# Remember to put your real credentials here!
TWILIO_ACCOUNT_SID = 'AC6ca42c757c57454bfcbb1b43173a1edc'
TWILIO_AUTH_TOKEN = 'cd5b86889ad16f3cd04d44e9eacf8ab0'
TWILIO_PHONE_NUMBER = '+1 707 353 4169' 

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

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

BASE_URL = "http://127.0.0.1:8000"

def resolve_photo(p: Provider):
    url = p.photo_url or ""
    return f"{BASE_URL}{url}" if url.startswith("/static/") else url

# --- 6. Endpoints ---

# Call Masking Feature
@app.post("/initiate-call/")
def initiate_call(data: dict):
    customer_phone = data.get("customer_phone")
    provider_phone = data.get("provider_phone")
    
    if not customer_phone or not provider_phone:
        raise HTTPException(status_code=400, detail="Missing phone numbers")

    try:
        call = client.calls.create(
            to=customer_phone,
            from_=TWILIO_PHONE_NUMBER,
            twiml=f'<Response><Say>Connecting you to Sevamitra Professional.</Say><Dial>{provider_phone}</Dial></Response>'
        )
        return {"msg": "Call initiated", "sid": call.sid}
    except Exception as e:
        print(f"Twilio Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Provider Management
@app.get("/providers/")
def get_providers():
    with get_db() as db:
        data = db.query(Provider).all()
        return [
            {
                "id": p.id, "name": p.name, "category": p.category,
                "phone": p.phone, "location": p.location,
                "photo_url": resolve_photo(p),
                "experience": p.experience, "rating": p.rating, "base_price": p.base_price
            }
            for p in data
        ]

@app.post("/providers/")
def create_provider(
    name: str = Form(...), category: str = Form(...), phone: str = Form(...),
    location: str = Form(...), experience: int = Form(...),
    rating: str = Form(...), base_price: int = Form(...),
    file: UploadFile = File(...)
):
    ext = os.path.splitext(file.filename)[1]
    fname = f"{uuid.uuid4()}{ext}"
    with open(os.path.join(UPLOAD_DIR, fname), "wb") as f:
        shutil.copyfileobj(file.file, f)
    with get_db() as db:
        db.add(Provider(
            name=name, category=category, phone=phone, location=location,
            photo_url=f"/static/{fname}", experience=experience,
            rating=rating, base_price=base_price
        ))
    return {"msg": "Provider created"}

@app.put("/providers/{provider_id}")
def update_provider(
    provider_id: int,
    name: str = Form(...), category: str = Form(...), phone: str = Form(...),
    location: str = Form(...), experience: int = Form(...),
    rating: str = Form(...), base_price: int = Form(...),
    file: UploadFile = File(None)
):
    with get_db() as db:
        provider = db.query(Provider).filter(Provider.id == provider_id).first()
        if not provider:
            raise HTTPException(status_code=404, detail="Provider not found")

        provider.name, provider.category, provider.phone = name, category, phone
        provider.location, provider.experience, provider.rating = location, experience, rating
        provider.base_price = base_price

        if file and file.filename:
            if provider.photo_url:
                old_path = os.path.join(UPLOAD_DIR, os.path.basename(provider.photo_url))
                if os.path.exists(old_path): os.remove(old_path)
            ext = os.path.splitext(file.filename)[1]
            fname = f"{uuid.uuid4()}{ext}"
            with open(os.path.join(UPLOAD_DIR, fname), "wb") as f:
                shutil.copyfileobj(file.file, f)
            provider.photo_url = f"/static/{fname}"
    return {"msg": "Provider updated"}

@app.delete("/providers/{provider_id}")
def delete_provider(provider_id: int):
    with get_db() as db:
        provider = db.query(Provider).filter(Provider.id == provider_id).first()
        if not provider: raise HTTPException(status_code=404, detail="Provider not found")
        if provider.photo_url:
            old_path = os.path.join(UPLOAD_DIR, os.path.basename(provider.photo_url))
            if os.path.exists(old_path): os.remove(old_path)
        db.delete(provider)
    return {"msg": "Provider deleted"}

# Booking Management
@app.get("/bookings/")
def get_bookings():
    with get_db() as db:
        results = db.query(Booking, Provider).outerjoin(Provider, Booking.provider_id == Provider.id).all()
        return [
            {
                "id": b.id, "customer_name": b.customer_name,
                "customer_phone": b.customer_phone,
                "worker_name": p.name if p else "Unknown",
                "category": p.category if p else "Service",
                "time": b.created_at.isoformat(), "status": b.status,
                "cancel_reason": b.cancel_reason
            }
            for b, p in results
        ]

@app.post("/bookings/")
def make_booking(data: dict):
    with get_db() as db:
        db.add(Booking(
            customer_name=data.get("customer_name", ""),
            customer_phone=data.get("customer_phone", ""),
            provider_id=data.get("provider_id")
        ))
    return {"msg": "Booking confirmed"}

@app.put("/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: int, reason_data: dict):
    with get_db() as db:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking: raise HTTPException(status_code=404, detail="Booking not found")
        booking.status = "Cancelled"
        booking.cancel_reason = reason_data.get("reason", "Not specified")
    return {"msg": "Booking cancelled"}


# --- 7. SERVE FRONTEND (ADDED THIS SECTION) ---
DIST_DIR = os.path.join(os.getcwd(), "nyra-frontend", "dist")

if os.path.exists(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        return FileResponse(os.path.join(DIST_DIR, "index.html"))