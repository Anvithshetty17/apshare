# QuickShare - Deploy from Docker Hub

Share files and text instantly with 4-digit codes! Auto-deletes after 10 minutes.

## 🚀 Quick Start - Pull from Docker Hub

### Prerequisites
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))

### Method 1: Using Docker Compose (Easiest)

**Step 1:** Create a `docker-compose.yml` file:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: quickshare-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - quickshare-network

  backend:
    image: anvithshetty17/quickshare-backend:latest
    container_name: quickshare-backend
    ports:
      - "5001:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/quickshare
      - PORT=5000
    depends_on:
      - mongodb
    networks:
      - quickshare-network

  frontend:
    image: anvithshetty17/quickshare-frontend:latest
    container_name: quickshare-frontend
    ports:
      - "3001:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5001/api
    depends_on:
      - backend
    networks:
      - quickshare-network

volumes:
  mongodb_data:

networks:
  quickshare-network:
    driver: bridge
```

**Step 2:** Run the application:
```bash
docker-compose up -d
```

**Step 3:** Open http://localhost:3001

---

### Method 2: Manual Docker Commands

**Step 1:** Create network
```bash
docker network create quickshare-network
```

**Step 2:** Start MongoDB
```bash
docker run -d \
  --name quickshare-mongodb \
  --network quickshare-network \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest
```

**Step 3:** Pull and run Backend
```bash
docker pull anvithshetty17/quickshare-backend:latest

docker run -d \
  --name quickshare-backend \
  --network quickshare-network \
  -p 5001:5000 \
  -e MONGODB_URI=mongodb://quickshare-mongodb:27017/quickshare \
  -e PORT=5000 \
  anvithshetty17/quickshare-backend:latest
```

**Step 4:** Pull and run Frontend
```bash
docker pull anvithshetty17/quickshare-frontend:latest

docker run -d \
  --name quickshare-frontend \
  --network quickshare-network \
  -p 3001:3000 \
  -e REACT_APP_API_URL=http://localhost:5001/api \
  anvithshetty17/quickshare-frontend:latest
```

**Step 5:** Open http://localhost:3001

---

## 📦 Docker Hub Images

- **Backend**: https://hub.docker.com/r/anvithshetty17/quickshare-backend
- **Frontend**: https://hub.docker.com/r/anvithshetty17/quickshare-frontend

Direct pull commands:
```bash
docker pull anvithshetty17/quickshare-backend:latest
docker pull anvithshetty17/quickshare-frontend:latest
docker pull mongo:latest
```

---

## 🛑 Stop & Remove

**Using Docker Compose:**
```bash
docker-compose down
```

**Manual method:**
```bash
docker stop quickshare-frontend quickshare-backend quickshare-mongodb
docker rm quickshare-frontend quickshare-backend quickshare-mongodb
```

---

## 🔄 Update to Latest Version

**Docker Compose:**
```bash
docker-compose pull
docker-compose up -d
```

**Manual:**
```bash
docker pull anvithshetty17/quickshare-backend:latest
docker pull anvithshetty17/quickshare-frontend:latest
docker stop quickshare-frontend quickshare-backend
docker rm quickshare-frontend quickshare-backend
# Run the docker run commands again from Step 3 & 4
```

---

## 🎯 How to Use QuickShare

1. Open http://localhost:3001
2. **Share:** Upload file/text → Get 4-digit code
3. **Receive:** Enter code → Download file/text
4. ⏰ Auto-deletes after 10 minutes

---

## ✨ Quick Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker logs quickshare-frontend
docker logs quickshare-backend

# Restart
docker-compose restart

# Remove all data
docker-compose down -v
```

---

**Made with ❤️ by Anvith Shetty**  
🐳 Docker Hub: [anvithshetty17](https://hub.docker.com/u/anvithshetty17)