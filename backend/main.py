from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr, constr
import mysql.connector
import pandas as pd
import shutil

app = FastAPI()

# CORS Middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# MySQL Database Connection
db = mysql.connector.connect(
    host="localhost",
    user="root",           # Update if needed
    password="",           # Add your MySQL password if needed
    database="user_management"
)
cursor = db.cursor()

# User schema with Pydantic v2-compatible validation
class User(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: constr(pattern=r"^\d{10}$")  # 10-digit phone number
    pan: constr(pattern=r"^[A-Z]{5}\d{4}[A-Z]{1}$")  # PAN format

# Create user
@app.post("/users")
def create_user(user: User):
    sql = "INSERT INTO users (first_name, last_name, email, phone, pan) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(sql, (user.first_name, user.last_name, user.email, user.phone, user.pan))
    db.commit()
    return {"message": "User added"}

# Get all users
@app.get("/users")
def get_users():
    cursor.execute("SELECT id, first_name, last_name, email, phone, pan FROM users")
    rows = cursor.fetchall()
    return [{"id": r[0], "first_name": r[1], "last_name": r[2], "email": r[3], "phone": r[4], "pan": r[5]} for r in rows]

# Get user by ID
@app.get("/users/{user_id}")
def get_user(user_id: int):
    cursor.execute("SELECT id, first_name, last_name, email, phone, pan FROM users WHERE id = %s", (user_id,))
    row = cursor.fetchone()
    if row:
        return {"id": row[0], "first_name": row[1], "last_name": row[2], "email": row[3], "phone": row[4], "pan": row[5]}
    raise HTTPException(status_code=404, detail="User not found")

# Update user
@app.put("/users/{user_id}")
def update_user(user_id: int, user: User):
    sql = "UPDATE users SET first_name=%s, last_name=%s, email=%s, phone=%s, pan=%s WHERE id=%s"
    cursor.execute(sql, (user.first_name, user.last_name, user.email, user.phone, user.pan, user_id))
    db.commit()
    return {"message": "User updated"}

# Delete user
@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    db.commit()
    return {"message": "User deleted"}

# Upload Excel file
@app.post("/upload-excel")
def upload_excel(file: UploadFile = File(...)):
    path = f"temp_{file.filename}"
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    df = pd.read_excel(path)
    for _, row in df.iterrows():
        try:
            cursor.execute(
                "INSERT INTO users (first_name, last_name, email, phone, pan) VALUES (%s, %s, %s, %s, %s)",
                (row["first_name"], row["last_name"], row["email"], str(row["phone"]), row["pan"])
            )
        except Exception as e:
            continue  # Skip invalid rows

    db.commit()
    return {"message": "Excel uploaded successfully"}

# Download sample Excel
@app.get("/download-sample")
def download_sample():
    return FileResponse("sample_template.xlsx", media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename="sample_template.xlsx")
