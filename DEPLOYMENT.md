# Deployment Guide

This guide covers multiple deployment options for Construction SaaS.

## Table of Contents

- [Vercel Deployment](#vercel-deployment)
- [Railway Deployment](#railway-deployment)
- [Docker Deployment](#docker-deployment)
- [Manual Deployment](#manual-deployment)

## Prerequisites

Before deploying, ensure you have:

- A PostgreSQL database (or use providers' managed databases)
- OpenAI API key
- QuickBooks Developer credentials (optional)
- Environment variables configured

## Vercel Deployment

Vercel is the recommended platform for Next.js applications.

### Step 1: Prepare Your Repository

1. Push your code to GitHub, GitLab, or Bitbucket
2. Ensure `.env.example` is in your repository

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `construction-saas`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Configure Environment Variables

Add these environment variables in Vercel:

```env
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-your-key
QB_CLIENT_ID=your-qb-client-id
QB_CLIENT_SECRET=your-qb-client-secret
QB_REDIRECT_URI=https://yourdomain.vercel.app/api/integrations/quickbooks/callback
QB_ENVIRONMENT=production
NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
NODE_ENV=production
```

### Step 4: Database Setup

1. Use a managed PostgreSQL service:
   - **Vercel Postgres** (recommended)
   - **Supabase** (free tier available)
   - **Neon** (serverless Postgres)
   - **Railway** (PostgreSQL addon)

2. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Step 5: Deploy

Click "Deploy" and Vercel will build and deploy your application.

## Railway Deployment

Railway provides a simple deployment experience with managed databases.

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### Step 2: Initialize Railway Project

```bash
cd construction-saas
railway init
```

### Step 3: Add PostgreSQL Database

```bash
railway add postgresql
```

Railway will automatically set `DATABASE_URL` environment variable.

### Step 4: Set Environment Variables

```bash
railway variables set JWT_SECRET="your-secret-key"
railway variables set OPENAI_API_KEY="sk-your-key"
railway variables set QB_CLIENT_ID="your-qb-client-id"
railway variables set QB_CLIENT_SECRET="your-qb-client-secret"
railway variables set NEXT_PUBLIC_APP_URL="https://your-app.railway.app"
railway variables set NODE_ENV="production"
```

### Step 5: Deploy

```bash
railway up
```

### Step 6: Run Migrations

```bash
railway run npx prisma migrate deploy
```

## Docker Deployment

Deploy using Docker and docker-compose for full control.

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/construction-saas.git
cd construction-saas/construction-saas
```

### Step 2: Configure Environment

Create a `.env` file:

```env
DB_PASSWORD=secure-password
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-your-key
QB_CLIENT_ID=your-qb-client-id
QB_CLIENT_SECRET=your-qb-client-secret
QB_REDIRECT_URI=http://localhost:3000/api/integrations/quickbooks/callback
QB_ENVIRONMENT=sandbox
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Build and Run

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Next.js app on port 3000
- Redis cache on port 6379

### Step 4: Run Migrations

```bash
docker-compose exec app npx prisma migrate deploy
```

### Step 5: Access Application

Open http://localhost:3000

### Production Docker Deployment

For production, modify `docker-compose.yml`:

1. Use environment variables for secrets
2. Set up SSL/TLS with nginx reverse proxy
3. Configure backups for PostgreSQL
4. Use Docker secrets for sensitive data

Example nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Manual Deployment (VPS/Cloud Server)

Deploy on any Ubuntu/Debian server.

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2
```

### Step 2: Database Setup

```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE construction_saas;
CREATE USER construction WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE construction_saas TO construction;
\q
```

### Step 3: Clone and Build

```bash
# Clone repository
git clone https://github.com/yourusername/construction-saas.git
cd construction-saas/construction-saas

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Edit with your values

# Run migrations
npx prisma migrate deploy
npx prisma generate

# Build application
npm run build
```

### Step 4: Start with PM2

```bash
pm2 start npm --name "construction-saas" -- start
pm2 save
pm2 startup
```

### Step 5: Configure nginx

```bash
sudo apt install -y nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/construction-saas
```

Add:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and start:

```bash
sudo ln -s /etc/nginx/sites-available/construction-saas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Verify database connectivity
- [ ] Test file uploads
- [ ] Configure QuickBooks OAuth callback URL
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Configure automated backups
- [ ] Set up uptime monitoring
- [ ] Review security headers
- [ ] Enable rate limiting
- [ ] Set up CI/CD pipeline

## Environment-Specific Notes

### Development
- Use SQLite for local development
- Use `QB_ENVIRONMENT=sandbox`
- Enable detailed error messages

### Staging
- Use PostgreSQL
- Test QuickBooks integration
- Use production-like data

### Production
- Use managed PostgreSQL with backups
- Set `QB_ENVIRONMENT=production`
- Enable all security features
- Configure CDN for static assets
- Set up monitoring and alerts
- Regular security updates

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database server is accessible
- Ensure firewall allows connections

### Build Failures
- Clear `.next` directory and rebuild
- Check Node.js version (18+)
- Verify all dependencies installed

### QuickBooks Integration
- Verify callback URL matches exactly
- Check QB_ENVIRONMENT setting
- Ensure OAuth credentials are valid

### Performance Issues
- Enable Redis caching
- Configure CDN
- Optimize images
- Enable database connection pooling

## Support

For deployment help:
- Check [GitHub Issues](https://github.com/yourusername/construction-saas/issues)
- Join community discussions
- Review troubleshooting guide

---

**Security Note**: Never commit `.env` files or expose sensitive credentials. Always use environment variables or secret management systems.
