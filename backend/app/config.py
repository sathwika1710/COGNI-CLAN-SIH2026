import os

from dotenv import load_dotenv


load_dotenv()


DATABASE_URL = os.getenv(
    "DATABASE_URL"
)


APP_NAME = "CogniCare API"


DEBUG = os.getenv(
    "DEBUG",
    "True"
).lower() == "true"