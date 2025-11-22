# EC2 Deployment Guide

## Issues Fixed
1. ✅ Server now binds to `0.0.0.0` to accept external connections
2. ✅ CORS configured for production with configurable frontend URL

## Important Notes

### Available Endpoints
Your backend API has these endpoints:

**Public Endpoints:**
- `GET /api/ping` - Health check (use this to test your deployment)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

**Protected Endpoints (require JWT token in Authorization header):**
- `GET /api/auth/profile` - Get logged-in user profile
- `GET /api/inventory` - List all inventory items for user
- `POST /api/inventory` - Create new inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

**Note:** `/attack-payload` does not exist. Use `/api/ping` to test connectivity.

## EC2 Deployment Steps

### 1. Security Group Configuration
Ensure your EC2 security group allows:
- **Inbound:** Port 4000 (TCP) from your IP or 0.0.0.0/0 (if public)
- **Outbound:** All traffic (for MySQL connection)

### 2. Environment Variables
Create a `.env` file on your EC2 instance:

```bash
DB_HOST=your-rds-endpoint-or-ec2-mysql
DB_PORT=3306
DB_NAME=mean_auth
DB_USER=your_username
DB_PASS=your_password
JWT_SECRET=your-secret-key-min-32-chars
PORT=4000
# FRONTEND_URL is optional - can add later when frontend is deployed
```

### 3. Database Setup
- Ensure MySQL is accessible from EC2
- Create the database: `CREATE DATABASE mean_auth;`
- Or use AWS RDS for managed MySQL

### 4. HTTPS Setup (Recommended)
Since you're using `https://` in your URL:

**Option A: Use nginx as reverse proxy (Recommended)**
```nginx
server {
    listen 443 ssl;
    server_name 3.0.209.110;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Option B: Test with HTTP first**
Use `http://3.0.209.110:4000/api/ping` (not https) to verify it works

### 5. Running the Server

```bash
# Install dependencies
npm install

# Run in production (consider using PM2)
npm start

# Or with PM2 for process management
npm install -g pm2
pm2 start index.js --name backend
pm2 save
pm2 startup
```

### 6. Testing

Test from your local machine:
```bash
# Test health endpoint
curl http://3.0.209.110:4000/api/ping

# Should return: {"message":"pong"}
```

### 7. Firewall (if using Ubuntu/Debian)
```bash
sudo ufw allow 4000/tcp
sudo ufw reload
```

## Troubleshooting

### "Connection refused"
- Check security group allows port 4000
- Check server is bound to `0.0.0.0` (not `localhost`)
- Check firewall rules on EC2 instance

### "Cannot connect to database"
- Verify MySQL is running and accessible
- Check `.env` database credentials
- Test MySQL connection: `mysql -h DB_HOST -u DB_USER -p`

### HTTPS errors
- Express runs HTTP by default on port 4000
- Use nginx/CloudFront/ALB for HTTPS
- Or test with HTTP first: `http://3.0.209.110:4000/api/ping`

### CORS errors
- CORS is currently set to allow all origins (`*`)
- When you add a frontend, update `FRONTEND_URL` in `.env` and CORS settings in `index.js`

## Quick Test Commands

### Test Health Endpoint
```bash
curl http://3.0.209.110:4000/api/ping
# Expected: {"message":"pong"}
```

### Test Registration (no frontend needed)
```bash
curl -X POST http://3.0.209.110:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Test Login
```bash
curl -X POST http://3.0.209.110:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
# Returns: {"user":{...},"token":"..."}
```

### Test Protected Endpoint (after login, use the token)
```bash
curl http://3.0.209.110:4000/api/inventory \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

