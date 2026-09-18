#!/bin/sh
set -e

docker-compose down --remove-orphans

# Phase 1: build & start backend only
docker-compose build divestrael-api
docker-compose up -d divestrael-api

# Phase 2: wait for it to actually serve data (not just "container running")
MAX_WAIT=60
elapsed=0
echo "Trying to connect to backend"
until docker-compose exec -T divestrael-api node -e "fetch('http://localhost:4000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))" > /dev/null 2>&1; do
  elapsed=$((elapsed + 1))
  echo "  still waiting... (${elapsed}s)"
  if [ "$elapsed" -ge "$MAX_WAIT" ]; then
    echo "Timed out waiting for backend" >&2
    exit 1
  fi
  sleep 1
done
echo "Backend ready."

# Phase 3: build frontend — now it can reach BE during next build
docker-compose build divestrael

# Phase 4: bring everything up
docker-compose up -d divestrael