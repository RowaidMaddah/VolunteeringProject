from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import smtplib
from email.message import EmailMessage
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://rowaidmaddah.github.io",
        "https://volunteeringproject-api.onrender.com",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_origin_regex=r"https://[a-z0-9-]+-\d+\.app\.github\.dev",
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

class CommandRequest(BaseModel):
    command: str

class ContactRequest(BaseModel):
    email: EmailStr
    message: str


@app.post("/api/terminal")
async def process_terminal_command(req: CommandRequest):
    cmd = " ".join(req.command.split()).lower()
    
    if cmd == "help":
        return {
            "output": "Available commands:\n"
            "scan\n"
            "curl http://target:8080\n"
            "sqli ' OR '1'='1\n"
            "dump users\n"
            "matrix\n"
            "nmap\n"
            "cat flag.txt\n"
            "clear (clears the terminal)"
        }
    elif cmd == "scan":
        return {"output": "[+] Scanning 127.0.0.1...\n[!] Found Port 8080: HTTP (Vulnerable Login Portal)"}
    elif cmd == "curl http://target:8080":
        return {"output": "HTTP/1.1 200 OK\nServer: Dera360-Auth-Service v1.0\nAuth-Type: SQL Database Check"}
    elif cmd == "sqli ' or '1'='1":
        return {"output": "[SUCCESS] Query executed: SELECT * FROM users WHERE user='' OR '1'='1';\n[!] Access Granted! Logged in as ADMIN."}
    elif cmd.startswith("sqli"):
        return {"output": "Usage: sqli ' OR '1'='1"}
    elif cmd == "dump users":
        return {"output": "[+] EXFILTRATING DATABASE:\nID | USERNAME | ROLE   | HASH\n1  | admin    | Admin  | $2b$12$e8x...\n2  | guest    | User   | $2b$12$a1q..."}
    elif cmd == "matrix":
        return {"output": "01000100 01000101 01010010 01000001 00110011 00110110 00110000\n[+] Accessing neural interface...\n[!] System breach simulated successfully."}
    elif cmd == "nmap":
        return {"output": "Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for target.internal (10.0.0.80)\nHost is up (0.0012s latency).\nPORT     STATE SERVICE\n80/tcp   OPEN  http\n8080/tcp OPEN  http-proxy (Vulnerable Auth Service)"}
    elif cmd.startswith("sudo"):
        return {"output": "guest is not in the sudoers file. This incident will be reported to the SOC."}
    elif cmd == "cat flag.txt":
        return {"output": "🚩 CTF{D3RA_360_S3CUR1TY_M4ST3R_2026}"}
    else:
        return {"output": f"bash: {cmd}: command not found. Type 'help' for available options."}


@app.post("/api/contact")
async def send_contact_email(req: ContactRequest):
    clean_message = req.message.strip()
    if len(clean_message) < 5 or len(clean_message) > 2000:
        raise HTTPException(status_code=400, detail="Message length must be between 5 and 2000 characters.")

    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
    SENDER_EMAIL = os.getenv("SENDER_EMAIL", "your-portfolio-email@gmail.com")
    SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "your-app-password")
    RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL", "your-personal-email@gmail.com")

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
