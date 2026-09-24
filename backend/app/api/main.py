from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.indices import router as index_router
from app.api.securities import router as security_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://stock-index-inky.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(index_router)
app.include_router(security_router)

@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {"status": "ok"}