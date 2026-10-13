#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/workspaces/VolunteeringProject"
LOG_DIR="/tmp/volunteeringproject-logs"
mkdir -p "$LOG_DIR"

start_if_needed() {
  local port="$1"
  local description="$2"
  local command="$3"

  if ss -ltn | awk '{print $4}' | grep -Eq ":${port}$"; then
    echo "${description} already running on port ${port}"
    return 0
  fi

  echo "Starting ${description} on port ${port}"
  nohup bash -lc "$command" > "$LOG_DIR/${description// /_}.log" 2>&1 &
}

start_if_needed 8000 "FastAPI backend" "cd '$APP_DIR' && uvicorn main:app --host 0.0.0.0 --port 8000"
start_if_needed 8080 "Static frontend" "cd '$APP_DIR' && python -m http.server 8080"

sleep 2

echo "Server status:"
ss -tln | grep -E ':8000|:8080' || true
