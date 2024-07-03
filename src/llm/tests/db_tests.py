import psycopg2
import os
from psycopg2 import sql


# Retrieve database connection details from environment variables
db_name = os.getenv('DB_NAME')  # Replace 'default_db_name' with a default if needed
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_host = os.getenv('DB_HOST')
db_port = os.getenv('DB_PORT')  # Default to 5432 if not specified

try:
    conn = psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port
    )
    cursor = conn.cursor()

    conn.autocommit = True #!
    dbname = sql.Identifier(f'sbx_nh')
    create_cmd = sql.SQL('CREATE DATABASE {}').format(dbname)
    cursor.execute(create_cmd)

    print("Connection to the database was successful!")
except Exception as e:
    print("Failed to connect to the database.")
    print(f"Error: {e}")
