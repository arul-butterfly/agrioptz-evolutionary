"""
AgriOpt - Crop Planning Optimizer Using a Genetic Algorithm.
FastAPI Main Application Entrypoint.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.dataset import router as dataset_router
from .routes.optimization import router as optimization_router

app = FastAPI(
    title="AgriOpt API",
    description="Crop Planning Optimizer using Genetic Algorithm and Evolutionary Computing",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration to allow local Vite frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(dataset_router)
app.include_router(optimization_router)


@app.get("/api/health")
async def health_check():
    """Health verification endpoint."""
    return {
        "status": "healthy",
        "service": "AgriOpt Optimization Engine",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/")
async def root():
    return {
        "message": "Welcome to AgriOpt API. Visit /docs for the interactive Swagger documentation.",
        "project": "AgriOpt – Crop Planning Optimizer Using a Genetic Algorithm"
    }
