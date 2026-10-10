
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class CommandRequest(BaseModel):
    command: str

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
        return {"output": f"bash: {cmd}: command not found. Type 'help' for instructions."}
