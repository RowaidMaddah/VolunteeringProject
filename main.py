from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import smtplib
from email.message import EmailMessage

app = FastAPI()

# Enable CORS so the HTML frontend can talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins during local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class CommandRequest(BaseModel):
    command: str

class ContactRequest(BaseModel):
    email: EmailStr
    message: str


# ==========================================
# TERMINAL COMMAND ENDPOINT
# ==========================================
@app.post("/api/terminal")
async def process_terminal_command(req: CommandRequest):
    cmd = req.command.strip().lower()
    
    if cmd == "help":
        return {"output": "Available commands: scan, curl, sqli, dump, clear"}
    elif cmd == "scan":
        return {"output": "[+] Scanning 127.0.0.1...\n[!] Found Port 8080: HTTP (Vulnerable Login Portal)"}
    elif cmd == "curl http://target:8080":
        return {"output": "HTTP/1.1 200 OK\nServer: Dera360-Auth-Service v1.0\nAuth-Type: SQL Database Check"}
    elif cmd == "sqli ' or '1'='1":
        return {"output": "[SUCCESS] Query executed: SELECT * FROM users WHERE user='' OR '1'='1';\n[!] Access Granted! Logged in as ADMIN."}
    elif cmd == "dump users":
        return {"output": "[+] EXFILTRATING DATABASE:\nID | USERNAME | ROLE   | HASH\n1  | admin    | Admin  | $2b$12$e8x...\n2  | guest    | User   | $2b$12$a1q..."}
    else:
        return {"output": f"bash: {cmd}: command not found. Type 'help' for available options."}


# ==========================================
# SECURE CONTACT FORM EMAIL ENDPOINT
# ==========================================
@app.post("/api/contact")
async def send_contact_email(req: ContactRequest):
    clean_message = req.message.strip()
    if len(clean_message) < 5 or len(clean_message) > 2000:
        raise HTTPException(status_code=400, detail="Message length must be between 5 and 2000 characters.")

    # Replace these with your actual SMTP configuration details
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 465
    SENDER_EMAIL = "your-portfolio-email@gmail.com"
    SENDER_PASSWORD = "your-app-password"  # Use a secure App Password from your mail provider
    RECIPIENT_EMAIL = "your-personal-email@gmail.com"

    try:
        msg = EmailMessage()
        msg.set_content(f"New message from Dera 360 Contact Form:\n\nFrom: {req.email}\n\nMessage:\n{clean_message}")
        msg["Subject"] = f"🔔 New Dera 360 Portfolio Message from {req.email}"
        msg["From"] = SENDER_EMAIL
        msg["To"] = RECIPIENT_EMAIL

        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)

        return {"status": "success", "message": "Email sent successfully!"}
    except Exception as e:
        print(f"SMTP Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email due to a server error.")
