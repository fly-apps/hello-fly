from fastapi import FastAPI, Request

app = FastAPI()

@app.get("/")
def health():
    return {"status": "alive"}

@app.post("/tv-webhook")
async def tv_webhook(request: Request):
    data = await request.json()
    print("Webhook received:", data)
    return {"status": "ok"}
