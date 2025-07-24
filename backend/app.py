# backend/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

# Import routers
from api.modules.parents import routes as parent_routes
from api.core.database import check_database_connection

load_dotenv()

# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Smart Education Platform API...")
    
    # Check database connection
    if await check_database_connection():
        print("✅ Database connected successfully")
    else:
        print("❌ Database connection failed")
    
    yield
    
    # Shutdown
    print("👋 Shutting down API...")

# Create FastAPI app
app = FastAPI(
    title="Smart Education Platform API",
    description="Multi-tenant education CRM and communications platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Check if the API is running and database is connected"""
    db_status = await check_database_connection()
    
    if not db_status:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    return {
        "status": "healthy",
        "database": "connected",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "message": "Smart Education Platform API",
        "docs": "/docs",
        "health": "/health"
    }

# Include routers
app.include_router(parent_routes.router)

# Run the application
if __name__ == "__main__":
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    
    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=True,  # Auto-reload in development
        log_level="info"
    )
