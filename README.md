# 🚀 Multi-Modal Lab Project Setup

Welcome to the Multi-Modal Lab project! This README provides step-by-step instructions for setting up, starting, and shutting down the project.

# Manual Installation

## 📥 Clone the Repository

Clone the GitHub repository to your local machine using the following command:

```bash
git clone https://github.com/IyadElwy/Multi-Modal-Lab
```

Add `.env` file according to the `.env.example` file

## 🔧 Initial Setup

Create Python Virtual Environment and install dependencies

```bash
cd Multi-Modal-Lab/backend
```

```bash
python3 -m venv multimodallabenv
```

```bash
pip3 install -r requirements.txt
```

Install Frontend dependencies

```bash
cd Multi-Modal-Lab/frontend
```

```bash
npm i
```

## ▶️ Start the Project

Start MongoDB using Docker-Compose file

```bash
cd Multi-Modal-Lab
```

```bash
docker-compose -f mongo-docker-compose.yaml up
```

Start Data-Engine and Web-Server

```bash
cd Multi-Modal-Lab/backend
```

```bash
uvicorn main:app --reload
```

Start Frontend UI

```bash
cd Multi-Modal-Lab/frontend
```

```bash
npm run dev
```

Go to `http://localhost:3000/`

# Linux

## 📥 Clone the Repository

Clone the GitHub repository to your local machine using the following command:

```bash
git clone https://github.com/IyadElwy/Multi-Modal-Lab
```

Add `.env` file according to the `.env.example` file

Change your working directory to the project's root:

```bash
cd Multi-Modal-Lab
```

## 🔧 Initial Setup

Before running the project, you need to set up permissions and install necessary dependencies.

Set execute permissions for the shell scripts:

```bash
 chmod +x *.sh
```

## ▶️ Start the Project

Run the initial setup script:

```bash
./setup.sh
```

To start the project, run the following command:

```bash
./start.sh
```

Go to `http://localhost:8000`

## 🛑 Shutdown

Run the shutdown script:

```bash
./shutdown.sh
```

Enjoy using the Multi-Modal Lab! 🎉

# Windows

In development

# Mac

In development

# 📋 TODO

| Title                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Difficulty | Category          |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :---------------- |
| Fix installation scripts for linux                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Easy       | Config            |
| Add installation scripts for mac                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Moderate   | Config            |
| Add installation scripts for windows                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Moderate   | Config            |
| For annotation types like POS & NER, fix annotation view such that the highlighting remains after we return to the same record. To reproduce create a POS or NER annotation Job, highlight some text to annotate it, move to the next record, then return to the same record you just annotated. Notice that the annotations are there on the side but the highlighting is not                                                                                                                         | Moderate   | Frontend          |
| Allow processing of multiple voice files for `Voice to Text`                                                                                                                                                                                                                                                                                                                                                                                                                                           | Moderate   | Backend, Frontend |
| Allow processing of multiple voice files for `OCR Image to Text`                                                                                                                                                                                                                                                                                                                                                                                                                                       | Moderate   | Backend, Frontend |
| Add Progress bar or any other progress indicator to processes that may take up some time (ex. data collection, data processing, job creation, etc.)                                                                                                                                                                                                                                                                                                                                                    | Moderate   | Backend, Frontend |
| Modularize the Code even further than it already is. As an example you'll find a lot of routes in the backend that have business functionality but its best practice to separate business from functionality. In the frontend many components or pages could also be broken down to make them more readable, adjustable and make debugging easier.                                                                                                                                                     | Easy       | Backend, Frontend |
| Right now, if we delete a project or job it's corresponding MongoDB data is not deleted. This is a huge waste of storage                                                                                                                                                                                                                                                                                                                                                                               | Moderate   | Backend           |
| A lot of the routes are very slow because of a lot of computation that are done on the fly (A.K.A. On request) We need to optimize those routes by trying to find better way to send back the required data without needing to recompute every time. An example of this would be the calculation of the number of conflict as we could just store the data about the conflicts in documents instead of needing to check every time on every request which records have conflicts and which ones don't. | Hard       | Backend           |
