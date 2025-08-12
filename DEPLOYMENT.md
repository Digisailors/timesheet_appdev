# Deployment Guide

## Issue Fixed

The "Failed to fetch" error in deployment was caused by:

1. **Mixed Router Structure**: NextAuth was configured in the Pages Router (`src/pages/api/auth/[...nextauth].ts`) while the app uses App Router (`src/app/`)
2. **Hardcoded URLs**: Components were using hardcoded `http://localhost:3000` URLs instead of relative URLs or environment-aware URLs

## Changes Made

### 1. Moved NextAuth to App Router
- **Removed**: `src/pages/api/auth/[...nextauth].ts`
- **Added**: `src/app/api/auth/[...nextauth]/route.ts`

### 2. Created Environment-Aware API Utilities
- **Added**: `src/lib/api.ts` - Centralized API calling utility
- **Added**: `src/lib/env.ts` - Environment configuration

### 3. Updated All Components
Updated all protected pages to use the new `getSession()` utility instead of hardcoded URLs:
- Dashboard
- Employees
- Projects
- Settings
- Supervisors
- Timesheets
- Reports
- Vacations
- ProfileModal

### 4. Enhanced Next.js Configuration
Added CORS headers for API routes in `next.config.ts`

## Environment Variables Required

### For Local Development (.env.local)
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### For Production Deployment
```bash
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret-key
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

## Generate Secure Secret
```bash
openssl rand -base64 32
```

## Deployment Checklist

1. ✅ Set environment variables in your deployment platform
2. ✅ Ensure `NEXTAUTH_URL` matches your production domain
3. ✅ Generate and set a secure `NEXTAUTH_SECRET`
4. ✅ Update `NEXT_PUBLIC_API_BASE_URL` to your production API
5. ✅ Deploy the updated code

## Testing

After deployment:
1. Clear browser cache and cookies
2. Try logging in again
3. Check browser console for any remaining errors
4. Verify session API calls are working

## Troubleshooting

If you still see "Failed to fetch" errors:

1. **Check Environment Variables**: Ensure all required env vars are set in production
2. **Verify Domain**: Make sure `NEXTAUTH_URL` matches your actual domain
3. **Check CORS**: Ensure your API server allows requests from your frontend domain
4. **Network Tab**: Check browser network tab for specific error details

## Platform-Specific Notes

### Vercel
- Set environment variables in Vercel dashboard
- Ensure `NEXTAUTH_URL` is set to your Vercel domain

### Netlify
- Set environment variables in Netlify dashboard
- May need to add redirect rules for API routes

### Other Platforms
- Follow platform-specific environment variable setup
- Ensure proper handling of Next.js App Router
