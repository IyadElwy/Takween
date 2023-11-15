#!/bin/bash
chmod +x "$0"

docker-compose -f mongo-docker-compose.yaml up --no-start

cd backend || exit
if [ ! -d "multimodallabenv" ]; then
    python3 -m venv multimodallabenv
fi
source multimodallabenv/bin/activate
pip install -r requirements.txt
cd ..

cd frontend || exit
npm install

sudo apt-get install tesseract-ocr
