# 🚀 Takween Project Setup


# Manual Installation

## 📥 Clone the Repository

Clone the GitHub repository to your local machine using the following command:

```bash
git clone https://github.com/IyadElwy/Takween
```

Create `.env` file in `Takween/backend` according to the `.env.example` file also found in `Takween/backend`

## 🔧 Initial Setup

Create Python Virtual Environment and install dependencies

```bash
cd Takween/backend
```

```bash
python3 -m venv env
```

```bash
pip3 install -r requirements.txt
```

Install Frontend dependencies

```bash
cd Takween/frontend
```

```bash
npm i
```

## ▶️ Start the Project

Start 3rd party services (like DBs, etc.)

```bash
cd Takween
```

```bash
docker compose up
```

### Activate python environemnt

```bash
cd Takween/backend
```
Check how to activate python env for windows

### Start Backend services
For each service in `Takween/backend/services` do:
```bash
cd Takween/backend/services/[service_name]
```

```bash
python3 run.py
```