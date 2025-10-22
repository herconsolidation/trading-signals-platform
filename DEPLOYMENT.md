# Trading Signals Platform - Deployment Guide

## Overview

This guide covers deploying the Trading Signals Platform to production environments.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Security Considerations](#security-considerations)
7. [Monitoring & Maintenance](#monitoring--maintenance)

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Database backup strategy in place
- [ ] SSL certificates obtained
- [ ] Domain name configured
- [ ] Admin password changed from default
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Documentation reviewed
- [ ] Monitoring tools configured

## Environment Setup

### Production Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database - Use MongoDB Atlas or your production MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trading-signals?retryWrites=true&w=majority

# JWT Secret - Generate a strong secret
JWT_SECRET=your-production-jwt-secret-min-32-characters
JWT_EXPIRE=7d

# Admin Credentials - Change these!
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=StrongPassword123!

# CORS - Your production frontend URL
FRONTEND_URL=https://yourdomain.com

# Payment Integration (when ready)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

#### Frontend (.env.production)
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_SOCKET_URL=https://api.yourdomain.com
```

## Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier or paid plan

2. **Create Cluster**
   - Choose cloud provider (AWS, GCP, Azure)
   - Select region closest to your users
   - Choose cluster tier based on needs

3. **Configure Security**
   - Create database user
   - Set strong password
   - Add IP whitelist (0.0.0.0/0 for all IPs or specific IPs)

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace <password> with your database password
   - Update MONGODB_URI in backend .env

5. **Create Database**
   ```javascript
   // Database will be created automatically on first connection
   // Collections: users, signals, subscriptions
   ```

### Option 2: Self-Hosted MongoDB

1. **Install MongoDB on Server**
   ```bash
   # Ubuntu/Debian
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Configure MongoDB**
   ```bash
   # Edit MongoDB config
   sudo nano /etc/mongod.conf
   
   # Enable authentication
   security:
     authorization: enabled
   
   # Bind to all interfaces (or specific IP)
   net:
     bindIp: 0.0.0.0
   ```

3. **Create Admin User**
   ```javascript
   mongosh
   use admin
   db.createUser({
     user: "admin",
     pwd: "strongpassword",
     roles: ["root"]
   })
   ```

4. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

## Backend Deployment

### Option 1: Deploy to VPS (DigitalOcean, AWS EC2, etc.)

1. **Prepare Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 (Process Manager)
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Upload Backend Code**
   ```bash
   # On your local machine
   cd backend
   
   # Create production build (if needed)
   npm install --production
   
   # Upload to server (using scp or git)
   scp -r . user@your-server:/var/www/trading-signals-backend
   
   # Or use git
   ssh user@your-server
   cd /var/www
   git clone your-repo trading-signals-backend
   cd trading-signals-backend/backend
   npm install --production
   ```

3. **Configure Environment**
   ```bash
   # Create .env file on server
   nano .env
   # Paste production environment variables
   ```

4. **Start with PM2**
   ```bash
   # Start application
   pm2 start server.js --name trading-signals-api
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup
   ```

5. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/trading-signals-api
   ```
   
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
       
       # WebSocket support
       location /socket.io/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }
   ```
   
   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/trading-signals-api /etc/nginx/sites-enabled/
   
   # Test configuration
   sudo nginx -t
   
   # Restart Nginx
   sudo systemctl restart nginx
   ```

6. **Setup SSL with Let's Encrypt**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx -y
   
   # Get SSL certificate
   sudo certbot --nginx -d api.yourdomain.com
   
   # Auto-renewal is configured automatically
   ```

### Option 2: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Prepare Backend**
   ```bash
   cd backend
   
   # Create Procfile
   echo "web: node server.js" > Procfile
   
   # Initialize git (if not already)
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Create Heroku App**
   ```bash
   heroku create trading-signals-api
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set FRONTEND_URL=https://yourdomain.com
   ```

4. **Deploy**
   ```bash
   git push heroku main
   
   # View logs
   heroku logs --tail
   ```

## Frontend Deployment

### Option 1: Deploy to Netlify

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   netlify deploy --prod --dir=build
   ```

3. **Configure Environment Variables**
   - Go to Netlify dashboard
   - Site settings > Build & deploy > Environment
   - Add REACT_APP_API_URL and REACT_APP_SOCKET_URL

### Option 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Project settings > Environment Variables
   - Add production variables

### Option 3: Deploy to VPS with Nginx

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to Server**
   ```bash
   scp -r build/* user@your-server:/var/www/trading-signals-frontend
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/trading-signals-frontend;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **Setup SSL**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

## Security Considerations

### 1. Environment Variables
- Never commit .env files to git
- Use strong, unique secrets for production
- Rotate secrets regularly
- Use environment variable management tools

### 2. Database Security
- Enable authentication
- Use strong passwords
- Limit IP access
- Enable SSL/TLS connections
- Regular backups
- Monitor access logs

### 3. API Security
- Use HTTPS only
- Implement rate limiting
- Add request validation
- Enable CORS properly
- Use security headers
- Implement API versioning

### 4. Application Security
- Keep dependencies updated
- Run security audits: `npm audit`
- Use helmet.js for Express
- Implement CSRF protection
- Sanitize user inputs
- Log security events

### 5. SSL/TLS
- Use Let's Encrypt for free SSL
- Enable HTTPS redirect
- Use strong cipher suites
- Enable HSTS
- Regular certificate renewal

## Monitoring & Maintenance

### 1. Application Monitoring

**PM2 Monitoring**
```bash
# View status
pm2 status

# View logs
pm2 logs trading-signals-api

# Monitor resources
pm2 monit
```

**Setup Monitoring Tools**
- New Relic
- DataDog
- Sentry for error tracking
- LogRocket for user sessions

### 2. Database Monitoring

**MongoDB Atlas**
- Use built-in monitoring
- Set up alerts
- Monitor performance metrics
- Track slow queries

**Self-Hosted**
- Use MongoDB Compass
- Monitor with mongostat
- Set up alerts
- Regular performance checks

### 3. Backup Strategy

**Database Backups**
```bash
# MongoDB backup
mongodump --uri="mongodb://..." --out=/backups/$(date +%Y%m%d)

# Automated daily backups
0 2 * * * /usr/bin/mongodump --uri="mongodb://..." --out=/backups/$(date +\%Y\%m\%d)
```

**Application Backups**
- Version control (Git)
- Regular code backups
- Configuration backups
- Document changes

### 4. Performance Optimization

**Backend**
- Enable compression
- Implement caching (Redis)
- Optimize database queries
- Use CDN for static assets
- Enable HTTP/2

**Frontend**
- Code splitting
- Lazy loading
- Image optimization
- Minification
- Gzip compression

### 5. Scaling

**Horizontal Scaling**
- Load balancer (Nginx, HAProxy)
- Multiple backend instances
- Database replication
- Session management (Redis)

**Vertical Scaling**
- Increase server resources
- Optimize code
- Database indexing
- Query optimization

## Post-Deployment Checklist

- [ ] All services running
- [ ] SSL certificates active
- [ ] Database connected
- [ ] Admin account accessible
- [ ] User registration working
- [ ] Signals creating and broadcasting
- [ ] Real-time updates working
- [ ] Payment flow tested (if integrated)
- [ ] Email notifications working (if configured)
- [ ] Monitoring tools active
- [ ] Backups configured
- [ ] Error tracking enabled
- [ ] Performance acceptable
- [ ] Security audit passed
- [ ] Documentation updated

## Troubleshooting

### Backend Not Starting
```bash
# Check PM2 logs
pm2 logs trading-signals-api

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check application logs
tail -f /var/www/trading-signals-backend/logs/app.log
```

### Database Connection Issues
```bash
# Test MongoDB connection
mongosh "mongodb://..."

# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### SSL Issues
```bash
# Test SSL certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test Nginx configuration
sudo nginx -t
```

## Support

For deployment assistance:
- Email: support@tradingsignals.com
- Documentation: See README.md and other guides

---

**Note**: This is a comprehensive deployment guide. Actual deployment steps may vary based on your specific hosting provider and requirements. Always test in a staging environment before deploying to production.