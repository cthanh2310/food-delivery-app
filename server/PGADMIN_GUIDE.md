# pgAdmin 4 - Beginner's Guide

## What is pgAdmin?

pgAdmin is a **web-based graphical interface** for managing PostgreSQL databases. Think of it as a visual tool that lets you:

- View and edit database tables
- Run SQL queries
- Create and modify database structures
- Monitor database performance
- Manage users and permissions

Instead of typing commands in a terminal, you can click through menus and see your data in a nice table format!

---

## 🚀 Getting Started with pgAdmin

### Step 1: Open pgAdmin in Your Browser

1. Make sure your Docker containers are running:

    ```bash
    docker-compose ps
    ```

2. Open your web browser and go to:

    ```
    http://localhost:5050
    ```

3. You should see a login page

### Step 2: Login to pgAdmin

Use these credentials (from your `.env` file):

- **Email**: `admin@admin.com`
- **Password**: `admin`

Click **Login**

---

## 📊 Step 3: Connect to Your Database

After logging in, you need to add your PostgreSQL server:

### 3.1 Create a New Server Connection

1. **Right-click** on "Servers" in the left sidebar
2. Select **Create** → **Server...**

### 3.2 Fill in the Connection Details

#### **General Tab:**

- **Name**: `Food Delivery DB` (or any name you like)

#### **Connection Tab:**

- **Host name/address**: `postgres`
    - ⚠️ **Important**: Use `postgres` (the container name), NOT `localhost`
- **Port**: `5432`
- **Maintenance database**: `postgres`
- **Username**: `postgres`
- **Password**: `postgres` (from your `.env` file)

#### **Save Password:**

- ✅ Check "Save password?" so you don't have to enter it every time

### 3.3 Click Save

You should now see your server connected in the left sidebar!

---

## 🗂️ Step 4: Explore Your Database

### Navigate to Your Database

In the left sidebar, expand:

```
Servers
  └── Food Delivery DB
      └── Databases
          └── food_delivery  ← Your database
              ├── Schemas
              │   └── public
              │       └── Tables
              │           └── users  ← Your users table
```

### View Table Data

1. **Expand**: `Servers` → `Food Delivery DB` → `Databases` → `food_delivery` → `Schemas` → `public` → `Tables`
2. **Right-click** on `users` table
3. Select **View/Edit Data** → **All Rows**

You'll see your data in a spreadsheet-like view! 📊

---

## 🔧 Common Tasks in pgAdmin

### 1. **View All Data in a Table**

- Right-click table → **View/Edit Data** → **All Rows**

### 2. **Run a SQL Query**

1. Click on **Tools** menu → **Query Tool**
2. Type your SQL query:
    ```sql
    SELECT * FROM users WHERE role = 'customer';
    ```
3. Click the **▶️ Execute** button (or press F5)
4. Results appear in the bottom panel

### 3. **Add a New Row**

**Method 1: Using the GUI**

1. Right-click table → **View/Edit Data** → **All Rows**
2. Click the **+** icon in the toolbar
3. Fill in the values
4. Click **Save** (disk icon)

**Method 2: Using SQL**

1. Open Query Tool
2. Run an INSERT query:
    ```sql
    INSERT INTO users (email, password_hash, first_name, last_name, role)
    VALUES ('john@example.com', 'hashed_password', 'John', 'Doe', 'customer');
    ```

### 4. **Edit Existing Data**

1. Right-click table → **View/Edit Data** → **All Rows**
2. Click on the cell you want to edit
3. Type the new value
4. Click **Save** (disk icon)

### 5. **Delete a Row**

1. Right-click table → **View/Edit Data** → **All Rows**
2. Click on the row number to select the entire row
3. Click the **Delete** icon (trash can)
4. Click **Save**

### 6. **Create a New Table**

1. Right-click on **Tables** → **Create** → **Table**
2. **General Tab**: Enter table name
3. **Columns Tab**: Add columns
    - Click **+** to add a column
    - Set name, data type, length, etc.
4. Click **Save**

### 7. **Export Data**

1. Right-click on table
2. Select **Import/Export Data**
3. Toggle **Export** option
4. Choose format (CSV, etc.)
5. Click **OK**

---

## 🎨 Understanding the pgAdmin Interface

### Left Sidebar (Browser Tree)

- Navigate through servers, databases, tables, etc.
- Right-click for context menus

### Top Menu Bar

- **File**: Save queries, preferences
- **Object**: Create/modify database objects
- **Tools**: Query Tool, Import/Export
- **Help**: Documentation

### Main Panel

- Shows properties, data, SQL, etc.
- Changes based on what you select

### Bottom Panel (in Query Tool)

- Shows query results
- Messages and errors

---

## 💡 Useful Tips for Beginners

### 1. **Query Tool Shortcuts**

- **F5**: Execute query
- **F7**: Format SQL (makes it pretty)
- **Ctrl + Space**: Auto-complete

### 2. **View Table Structure**

- Right-click table → **Properties**
- Go to **Columns** tab to see all fields

### 3. **See the SQL Behind Actions**

- When creating/editing objects, click the **SQL** tab
- This shows you the actual SQL command being run
- Great for learning SQL!

### 4. **Refresh the View**

- If you make changes via API or terminal, right-click and select **Refresh**

### 5. **Multiple Query Tabs**

- You can open multiple Query Tool tabs
- Each tab is independent

---

## 📝 Example: Common Queries for Your Food Delivery App

### See All Users

```sql
SELECT * FROM users;
```

### Find Users by Role

```sql
SELECT * FROM users WHERE role = 'customer';
```

### Count Total Users

```sql
SELECT COUNT(*) FROM users;
```

### Search by Email

```sql
SELECT * FROM users WHERE email LIKE '%example.com';
```

### Update a User's Name

```sql
UPDATE users
SET first_name = 'Jane', last_name = 'Smith'
WHERE email = 'test@example.com';
```

### Add a New User

```sql
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('new@example.com', 'hashed_password', 'New', 'User', 'customer');
```

### Delete a User

```sql
DELETE FROM users WHERE email = 'test@example.com';
```

---

## 🚨 Troubleshooting

### Can't Access http://localhost:5050

- Check if pgAdmin container is running: `docker-compose ps`
- Restart containers: `docker-compose restart`

### Can't Connect to Database

- Make sure you used `postgres` as the hostname (not `localhost`)
- Verify password matches your `.env` file
- Check if PostgreSQL container is running

### "Server doesn't listen" Error

- The containers might not be on the same network
- Try restarting: `docker-compose down && docker-compose up -d`

### Changes Not Showing

- Click **Refresh** (right-click → Refresh)
- Or press **F5** in the browser

---

## 🎯 Quick Reference Card

| Task             | How To                                        |
| ---------------- | --------------------------------------------- |
| **View data**    | Right-click table → View/Edit Data → All Rows |
| **Run SQL**      | Tools → Query Tool → Type query → F5          |
| **Add row**      | View data → Click + icon → Fill values → Save |
| **Edit data**    | View data → Click cell → Edit → Save          |
| **Delete row**   | View data → Select row → Delete icon → Save   |
| **Create table** | Right-click Tables → Create → Table           |
| **Refresh**      | Right-click → Refresh (or F5)                 |

---

## 🎓 Learning More

- **pgAdmin Docs**: https://www.pgadmin.org/docs/
- **PostgreSQL Tutorial**: https://www.postgresqltutorial.com/
- **SQL Practice**: Try writing queries in the Query Tool!

---

## ✅ Your First Task - Try This!

1. Open pgAdmin: http://localhost:5050
2. Login with `admin@admin.com` / `admin`
3. Add your server connection (use `postgres` as hostname)
4. Navigate to the `users` table
5. View all rows
6. Try adding a new user using the GUI
7. Run this query in Query Tool:
    ```sql
    SELECT email, first_name, last_name FROM users;
    ```

**Congratulations! You're now using pgAdmin!** 🎉

---

**Need help?** Check the troubleshooting section or ask questions!
