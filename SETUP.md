# NextAuth.js Setup Guide

This guide will help you set up NextAuth.js authentication for your timesheet application.

## 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Generate a Secure Secret

Run this command to generate a secure NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

## 2. What's Been Configured

### Authentication Files Created:
- `src/lib/auth.ts` - NextAuth configuration with credentials provider
- `src/app/api/auth/[...nextauth]/route.ts` - API route handler
- `src/middleware.ts` - Route protection middleware
- `src/components/SessionProvider.tsx` - Session provider component
- `src/hooks/useAuth.ts` - Custom authentication hook
- `src/components/ProtectedRoute.tsx` - Protected route wrapper
- `src/types/next-auth.d.ts` - TypeScript type extensions

### Updated Files:
- `src/app/layout.tsx` - Added SessionProvider
- `src/app/(auth)/login/page.tsx` - Updated to use NextAuth
- `src/components/AdminProfile/AdminProfileDropdown.tsx` - Updated logout
- `src/components/ui/sidebar.tsx` - Updated logout
- `src/app/(protected)/dashboard/page.tsx` - Added ProtectedRoute

## 3. Protected Routes

The following routes are now protected and require authentication:
- `/dashboard`
- `/employees`
- `/projects`
- `/settings`
- `/supervisors`
- `/timesheets`
- `/vacations`

## 4. How It Works

1. **Login**: Users authenticate through the login page using email/phone and password
2. **Session Management**: NextAuth handles session creation and management
3. **Route Protection**: Middleware automatically redirects unauthenticated users to `/login`
4. **Logout**: Users can logout through the profile dropdown or sidebar

## 5. Usage in Components

### Using the useAuth Hook:
```tsx
import { useAuth } from "@/hooks/useAuth"

function MyComponent() {
  const { user, isLoading, isAuthenticated } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Not authenticated</div>
  
  return <div>Welcome, {user?.name}!</div>
}
```

### Protecting a Page:
```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>This content is protected</div>
    </ProtectedRoute>
  )
}
```

## 6. Testing

1. Start your development server: `pnpm dev`
2. Navigate to `http://localhost:3000/login`
3. Try accessing a protected route without logging in - you should be redirected to login
4. Log in with valid credentials - you should be redirected to dashboard
5. Try accessing protected routes while logged in - they should work
6. Test logout functionality

## 7. Troubleshooting

### Common Issues:

1. **"Invalid NEXTAUTH_SECRET"**: Make sure you've set a valid NEXTAUTH_SECRET in your .env.local
2. **"Invalid NEXTAUTH_URL"**: Ensure NEXTAUTH_URL matches your development URL
3. **API errors**: Verify your NEXT_PUBLIC_API_BASE_URL is correct and your API is running
4. **TypeScript errors**: Make sure all imports are correct and the types file is properly configured

### Debug Mode:
Add this to your .env.local to enable debug logging:
```bash
NEXTAUTH_DEBUG=true
```

## 8. Production Deployment

For production, update your environment variables:
```bash
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

Make sure to use a strong, unique NEXTAUTH_SECRET in production!
