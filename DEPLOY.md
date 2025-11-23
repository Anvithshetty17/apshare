# QuickShare - Public Deployment Guide

Share files and text instantly with 4-digit codes! Auto-deletes after 10 minutes.

## 🚀 Quick Start (For Users)

### Prerequisites
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- No coding required!

### Installation Steps

1. **Download the docker-compose file**
   ```bash
   curl -o docker-compose.yml https://raw.githubusercontent.com/Anvithshetty17/Awt/master/docker-compose.public.yml
   ```
   
   Or manually create a `docker-compose.yml` file and copy the content from above.

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access QuickShare**
   - Open your browser: http://localhost:3001
   - That's it! 🎉

### How to Use

**Share Something:**
1. Go to http://localhost:3001
2. Choose "Share File" or "Share Text"
3. Upload/enter your content
4. Get a 4-digit code (e.g., 1234)

**Receive Something:**
1. Click "Receive" tab
2. Enter the 4-digit code
3. Get your file/text instantly!

⏰ **Note:** All shares auto-delete after 10 minutes for privacy.

## 📦 What Gets Installed

Three Docker containers:
- **Frontend** (Port 3001): User interface
- **Backend** (Port 5001): API server
- **MongoDB** (Port 27017): Database

Total download: ~400MB

## 🛑 Stop the Application

```bash
docker-compose down
```

To remove all data:
```bash
docker-compose down -v
```

## 🔧 Troubleshooting

**Port already in use?**
Edit the docker-compose.yml ports section:
```yaml
ports:
  - "8001:3000"  # Change 3001 to any free port
```

**Can't connect?**
```bash
docker-compose logs
```

**Start fresh:**
```bash
docker-compose down -v
docker-compose up -d
```

## 🌐 Deploy to Cloud

### Deploy to DigitalOcean/AWS/Azure

1. Create a virtual machine
2. Install Docker
3. Upload docker-compose.yml
4. Run `docker-compose up -d`
5. Configure your domain/firewall

### Environment Variables (Optional)

Create a `.env` file:
```env
FRONTEND_PORT=3001
BACKEND_PORT=5001
MONGODB_PORT=27017
```

## 📊 System Requirements

- **Minimum:** 2GB RAM, 2 CPU cores
- **Recommended:** 4GB RAM, 2 CPU cores
- **Storage:** 10GB available space

## 🔒 Security Notes

- Files/text auto-delete after 10 minutes
- No user authentication (public sharing)
- Use in trusted networks
- For production, add HTTPS/authentication

## 📝 License

Free to use and deploy!

## 💡 Features

✅ File sharing (up to 50MB)
✅ Text sharing (up to 10,000 characters)
✅ 4-digit codes for easy sharing
✅ Auto-deletion after 10 minutes
✅ No registration required
✅ Clean, modern UI

## 🆘 Support

Issues? Check:
- Docker Desktop is running
- Ports 3001, 5001, 27017 are available
- Internet connection for first-time setup

---

Made with ❤️ by Anvith Shetty | [GitHub](https://github.com/Anvithshetty17)
