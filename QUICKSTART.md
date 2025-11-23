# QuickShare - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Prerequisites
Make sure you have Docker installed:
- Download from: https://www.docker.com/get-started
- Verify installation: `docker --version` and `docker-compose --version`

### Step 2: Start the Application
Open PowerShell in the project directory and run:
```powershell
docker-compose up --build
```

Wait for all services to start (this may take 2-5 minutes on first run).

### Step 3: Use the Application
Open your browser and go to:
- **http://localhost:3000** - Main application
- **http://localhost:5000/health** - Backend health check

## 📱 How to Use

### Share a File
1. Click "Share" tab
2. Choose "Upload File"
3. Select your file
4. Click "Upload & Get Code"
5. Copy the 4-digit code
6. Share the code with anyone

### Share Text
1. Click "Share" tab
2. Choose "Share Text"
3. Type or paste your text
4. Click "Share & Get Code"
5. Copy the 4-digit code
6. Share the code with anyone

### Receive Files/Text
1. Click "Receive" tab
2. Enter the 4-digit code
3. Click "Get Content"
4. Files download automatically
5. Text displays on screen

## 🛑 Stop the Application
```powershell
docker-compose down
```

## 🔄 Restart Fresh
```powershell
docker-compose down -v
docker-compose up --build
```

## ❗ Troubleshooting

### Problem: Port already in use
**Solution**: Change ports in docker-compose.yml or stop the conflicting application

### Problem: MongoDB connection failed
**Solution**: Wait 30 seconds for MongoDB to fully start, then try again

### Problem: Cannot upload files
**Solution**: Check that backend/uploads directory exists and has write permissions

### Problem: Frontend shows connection error
**Solution**: Make sure backend is running (check http://localhost:5000/health)

## 📞 Need Help?
Check the full README.md for detailed documentation and troubleshooting.

## 🎉 That's It!
You're ready to start sharing files and text with QuickShare!
