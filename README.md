# COGNI_CLAN

## Smart India Hackathon 2026 — Prototype

### Problem Statement

**AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in North Eastern Region (NER)**

**Problem Statement ID:** SIH26003

**Team Name:** COGNI_CLAN

---

## Project Overview

COGNI_CLAN is a prototype developed for **Smart India Hackathon (SIH) 2026** based on the above problem statement.

The project demonstrates an AI-assisted cognitive gaming and memory assistance platform designed around the requirements described in the SIH problem statement.

This repository contains the source code of our working prototype, including the frontend, backend, AI/ML components, synthetic training data, authentication, database integration, and testing components.

---

## Prototype

The prototype consists of a web-based frontend connected to a Python FastAPI backend and AI/ML components.

The repository provides the source code required to understand, configure, and run the prototype locally.

---

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL

### AI / Machine Learning

- Python
- NumPy
- SciPy
- Scikit-learn
- PyTorch
- Transformers

### Development & Testing

- Git
- GitHub
- Python virtual environment
- Pytest

---

## Project Structure

```
COGNI_CLAN/
│
├── ai/
│   ├── data/
│   ├── explainability/
│   ├── inference/
│   ├── models/
│   ├── preprocessing/
│   └── training/
│
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   ├── routes/
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── security.py
│   │
│   ├── auth.py
│   ├── requirements.txt
│   └── .env.example
│
├── data/
│   └── synthetic/
│       └── training_data.csv
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── locales/
│   └── HTML pages
│
├── tests/
│
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt
```


# HOW TO RUN THE PROTOTYPE LOCALLY

Follow the steps below to run the COGNI_CLAN prototype on another laptop.

PREREQUISITES

Install the following:

Python 3.13 or later
PostgreSQL
Git
A modern web browser

Check the installations:

python --version

git --version

psql --version

CLONE THE REPOSITORY

Open PowerShell or Command Prompt and run:

git clone https://github.com/srinath0509-ops/COGNI-CLAN-TEAM-SIH-2026.git

cd COGNI-CLAN-TEAM-SIH-2026

CREATE A VIRTUAL ENVIRONMENT

Run:

python -m venv .venv

Activate the virtual environment:

..venv\Scripts\Activate.ps1

If PowerShell blocks activation, run:

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

Then activate again:

..venv\Scripts\Activate.ps1

INSTALL DEPENDENCIES

Run:

pip install -r requirements.txt

The required Python packages for the backend will be installed.

CONFIGURE ENVIRONMENT VARIABLES

Create the local environment file from the provided example:

copy .env.example .env

Configure the required values in the .env file.

Also check the backend environment configuration:

backend.env.example

Create the required backend .env file and configure the database and authentication settings.

IMPORTANT:
Do not upload the .env file to GitHub because it may contain passwords, API keys, or other sensitive information.

CONFIGURE POSTGRESQL

Install PostgreSQL and make sure the PostgreSQL service is running.

Create the required database for the project.

Update the PostgreSQL database connection details in the .env file.

Make sure the database username, password, host, port, and database name are correctly configured.

START THE BACKEND

Open PowerShell.

Navigate to the project:

cd COGNI-CLAN-TEAM-SIH-2026

Activate the virtual environment:

..venv\Scripts\Activate.ps1

Go to the backend folder:

cd backend

Start the FastAPI server:

uvicorn app.main:app --reload

The backend will run at:

http://127.0.0.1:8000

FastAPI API documentation:

http://127.0.0.1:8000/docs

Keep this terminal running.

START THE FRONTEND

Open a SECOND PowerShell or Command Prompt window.

Navigate to the project:

cd COGNI-CLAN-TEAM-SIH-2026

Go to the frontend folder:

cd frontend

Start the frontend server:

python -m http.server 5500

The frontend will run at:

http://127.0.0.1:5500

OPEN THE PROTOTYPE

Open a web browser and visit:

http://127.0.0.1:5500

The COGNI_CLAN prototype will now be accessible locally.

RUNNING THE COMPLETE PROTOTYPE

Keep both terminals running.

Terminal 1:

cd COGNI-CLAN-TEAM-SIH-2026

..venv\Scripts\Activate.ps1

cd backend

uvicorn app.main:app --reload

Terminal 2:

cd COGNI-CLAN-TEAM-SIH-2026

..venv\Scripts\Activate.ps1

cd frontend

python -m http.server 5500

Then open:

http://127.0.0.1:5500

API DOCUMENTATION

The FastAPI interactive API documentation can be accessed at:

http://127.0.0.1:8000/docs

TROUBLESHOOTING

If Python is not recognized:

Install Python and make sure it is added to the system PATH.

If there is a PostgreSQL connection error:

Make sure PostgreSQL is running.
Make sure the required database exists.
Check the PostgreSQL username and password.
Check the database configuration in the .env file.

If port 8000 is already in use:

uvicorn app.main:app --reload --port 8001

If port 5500 is already in use:

python -m http.server 5501

Then open:

http://127.0.0.1:5501
