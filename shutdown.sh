#!/bin/bash
chmod +x "$0"

docker-compose -f mongo-docker-compose.yaml stop

kill -9 $(lsof -t -i :3000)
echo "Frontend successfully shut down."

kill -9 $(lsof -t -i :8000)
echo "Backend successfully shut down."
