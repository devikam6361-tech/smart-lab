from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from database import engine, Base
import models
from routers import auth, students, labs, attendance, analytics, reports
from seed import seed_database

# Create all DB tables & seed initial data
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="SmartLab AI Attendance Management System API",
    description="End-to-end backend API for SmartLab AI, supporting role-based authentication, student & lab management, AI facial attendance analysis, entry/exit tracking, duration analytics, and reports.",
    version="1.0.0"
)

# Configure CORS for local development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(students.router, prefix="/api/v1")
app.include_router(labs.router, prefix="/api/v1")
app.include_router(attendance.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "SmartLab AI Attendance Management System API",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "auth": "/api/v1/auth",
            "students": "/api/v1/students",
            "labs": "/api/v1/labs",
            "attendance": "/api/v1/attendance",
            "analytics": "/api/v1/analytics",
            "reports": "/api/v1/reports"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

