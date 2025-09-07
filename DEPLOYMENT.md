# Deployment Guide

## Environment Variables Configuration

### For Vercel Deployment

The application is currently deployed at: **https://doto-lime.vercel.app/**

To ensure proper functionality, configure the following environment variables in your Vercel project settings:

#### Required Environment Variables

1. **MONGODB_URI**
   ```
   mongodb+srv://deep951india_db_user:RldyeNVLX06ZsshN@cluster0.qlrcf9g.mongodb.net/todo-app
   ```
   - Your MongoDB Atlas connection string
   - Make sure to replace with your actual credentials

2. **NEXTAUTH_URL**
   ```
   https://doto-lime.vercel.app
   ```
   - This should match your deployed domain
   - Critical for NextAuth.js authentication to work properly

3. **NEXTAUTH_SECRET**
   ```
   your-super-secret-key-change-this-in-production
   ```
   - Generate a secure random string for production
   - Use: `openssl rand -base64 32` to generate a secure secret

#### How to Set Environment Variables in Vercel

1. Go to your Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with the appropriate value
5. Make sure to select the appropriate environments (Production, Preview, Development)

### Local Development

For local development, use the `.env.local` file:

```bash
# Copy the example file
cp .env.example .env.local

# Edit the values according to your local setup
NEXTAUTH_URL=http://localhost:3000
```

## Database Configuration

The application uses MongoDB Atlas. Ensure:

1. Your MongoDB cluster allows connections from Vercel's IP ranges
2. Database user has read/write permissions
3. Connection string includes the correct database name

## API Endpoints

All API calls use relative paths and will automatically work with the deployed domain:

- `/api/tasks` - Task management
- `/api/analytics` - Analytics data
- `/api/auth/*` - Authentication endpoints
- `/api/user/*` - User management

## Troubleshooting

### Authentication Issues
- Verify `NEXTAUTH_URL` matches your deployment URL exactly
- Ensure `NEXTAUTH_SECRET` is set and secure
- Check that MongoDB connection is successful

### Database Issues
- Verify MongoDB URI is correct
- Check network access settings in MongoDB Atlas
- Ensure database user has proper permissions

### Build Issues
- All TypeScript and ESLint warnings have been resolved
- MongoDB version compatibility has been fixed (using v5.9.2)
- Dependencies are properly configured

## Site URL

Production Site: **https://doto-lime.vercel.app/**

The site will automatically use this URL for all internal API calls and authentication redirects when the `NEXTAUTH_URL` environment variable is properly configured.
