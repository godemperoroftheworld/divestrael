#!/bin/sh
set -e

# Phase 2: wait for it to actually serve data (not just "container running")
MAX_WAIT=60
elapsed=0
echo "Trying to connect to backend: ${DIVESTRAEL_BACKEND_URL}"
until curl -sf "${DIVESTRAEL_BACKEND_URL}/health" > /dev/null 2>&1; do
  elapsed=$((elapsed + 1))
  echo "  still waiting... (${elapsed}s)"
  if [ "$elapsed" -ge "$MAX_WAIT" ]; then
    echo "Timed out waiting for backend" >&2
    exit 1
  fi
  sleep 1
done
echo "Backend ready."

yarn build