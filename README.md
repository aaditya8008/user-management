#  User Management System

A full-stack application to manage users.  
Built with **React + Tailwind (Vite)** on the frontend and **FastAPI + MySQL** on the backend.

---

#  Folder Structure

 1. user-management # React frontend
 2. backend # FastAPI backend
 3. schema.sql # SQL script for DB setup (in backend)
 4. sample_template.xlsx # Excel upload template (in backend)


---

#  Technologies Used

**Frontend**
- React
- Vite
- Tailwind CSS
- React Router
- React Hot Toast

**Backend**
- FastAPI
- MySQL
- Uvicorn
- Pandas (Excel handling)
- OpenPyXL
- Email Validator

---

# Setup Instructions

# 1. Clone the repo

git clone https://github.com/aaditya8008/user-management

# 2. Backend Setup (Python 3.11+)
cd backend
**Create virtual environment**
- python -m venv venv
- venv\Scripts\activate

- pip install -r requirements.txt
- pip install email-validator python-multipart

**Make sure MySQL is running and DB is created**(XAMPP Used)
1. Open XAMPP Control Panel
2. Start the **MySQL** module

#### Option A: Use phpMyAdmin
- Go to `http://localhost/phpmyadmin`
- Click on "Import"
- Upload and run the `schema.sql` file

#### Option B: Use terminal
If MySQL is on your system path:
`mysql -u root < schema.sql`

**Run server**
uvicorn main:app --reload

# 3. Frontend Setup
cd user-management
1. npm install
2. npm run dev

# 4. Assumptions & Known Issues

1. Unique constraints on email and PAN are not enforced in the database.

2. No authentication is implemented.

3. Invalid Excel rows are skipped silently.




