#!/bin/bash
chmod +x "$0"

echo "Starting things up..."

docker-compose -f mongo-docker-compose.yaml up -d >/dev/null 2>&1 &

cd backend || exit
source multimodallabenv/bin/activate
nohup uvicorn main:app --reload >/dev/null 2>&1 &
cd ..
echo "Backend is up."

cd frontend || exit
nohup npm run dev >/dev/null 2>&1 &
echo "Frontend is up."
