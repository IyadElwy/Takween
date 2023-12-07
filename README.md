# 🚀 Multi-Modal Lab Project Setup

Welcome to the Multi-Modal Lab project! This README provides step-by-step instructions for setting up, starting, and shutting down the project.

# Linux

## 📥 Clone the Repository

Clone the GitHub repository to your local machine using the following command:

```bash
git clone https://github.com/IyadElwy/Multi-Modal-Lab
```

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

| Title                                                                                                                                                                                                                                                                                                                                                                          | Difficulty | Category          |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :---------------- |
| Fix installation scripts for linux                                                                                                                                                                                                                                                                                                                                             | Easy       | Config            |
| Add installation scripts for mac                                                                                                                                                                                                                                                                                                                                               | Moderate   | Config            |
| Add installation scripts for windows                                                                                                                                                                                                                                                                                                                                           | Moderate   | Config            |
| For annotation types like POS & NER, fix annotation view such that the highlighting remains after we return to the same record. To reproduce create a POS or NER annotation Job, highlight some text to annotate it, move to the next record, then return to the same record you just annotated. Notice that the annotations are there on the side but the highlighting is not | Moderate   | Frontend          |
| Allow processing of multiple voice files for `Voice to Text`                                                                                                                                                                                                                                                                                                                   | Moderate   | Backend, Frontend |
| Allow processing of multiple voice files for `OCR Image to Text`                                                                                                                                                                                                                                                                                                               | Moderate   | Backend, Frontend |
