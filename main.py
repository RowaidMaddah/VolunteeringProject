from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://rowaidmaddah.github.io",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_origin_regex=r"https://[a-z0-9-]+-\d+\.app\.github\.dev",
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


class CommandRequest(BaseModel):
    command: str


@app.post("/api/terminal")
async def process_terminal_command(req: CommandRequest):
    cmd = " ".join(req.command.split()).lower()

    if cmd == "help":
        return {
            "output": "Available commands:\n"
            "scan\n"
            "nmap\n"
            "matrix\n"
            "sudo (simulated; elevated commands are disabled)\n"
            "cat flag.txt\n"
            "curl http://target:8080\n"
            "sqli ' OR '1'='1\n"
            "dump users\n"
            "clear (clears the terminal)"
        }
    elif cmd == "scan":
        return {"output": "[+] Scanning 127.0.0.1...\n[!] Found Port 8080: HTTP (Vulnerable Login Portal)"}
    elif cmd == "nmap":
        return {
            "output": "Starting simulated Nmap scan for 127.0.0.1 (training target only)\n"
            "PORT     STATE SERVICE\n"
            "22/tcp   open  ssh (mock)\n"
            "8080/tcp open  http (mock)\n"
            "Scan complete. No network traffic was sent."
        }
    elif cmd == "matrix":
        return {
            "output": "Wake up, volunteer...\n"
            "01001101 01000001 01010100 01010010 01001001 01011000\n"
            "Follow the white rabbit.\n"
            "There is no spoon."
        }
    elif cmd == "cat flag.txt":
        return {"output": "TRAINING{curiosity_is_a_good_defense}"}
    elif cmd == "sudo" or cmd.startswith("sudo "):
        return {
            "output": "Permission denied: elevated commands are disabled in this simulated terminal."
        }
    elif cmd == "curl http://target:8080":
        return {"output": "HTTP/1.1 200 OK\nServer: Dera360-Auth-Service v1.0\nAuth-Type: SQL Database Check"}
    elif cmd == "sqli ' or '1'='1":
        return {"output": "[SUCCESS] Query executed: SELECT * FROM users WHERE user='' OR '1'='1';\n[!] Access Granted! Logged in as ADMIN."}
    elif cmd.startswith("sqli"):
        return {"output": "Usage: sqli ' OR '1'='1"}
    elif cmd == "dump users":
        return {"output": "[+] EXFILTRATING DATABASE:\nID | USERNAME | ROLE   | HASH\n1  | admin    | Admin  | $2b$12$e8x...\n2  | guest    | User   | $2b$12$a1q..."}
    else:
        return {"output": f"bash: {cmd}: command not found. Type 'help' for available options."}
