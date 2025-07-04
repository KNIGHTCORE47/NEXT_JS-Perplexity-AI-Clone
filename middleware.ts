import {
    clerkMiddleware,
    createRouteMatcher,
    auth
} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)', '/sign-up(.*)', '/api/inngest(.*)'
])

export default clerkMiddleware(async function (auth, request) {
    // NOTE - Extract User ID from Auth [Clerk] & URL from Request [Next.js]

    const response = auth();    // NOTE - Get response from Clerk Auth
    const user = await response;   // NOTE - Await Response for get User
    const userId = user?.userId;  // NOTE - Get User ID

    // NOTE - Logic [Restrict Authenticated user from accessing public routes]
    if (
        userId &&
        isPublicRoute(request)
    ) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // NOTE - Check for public routes [if not public, check for auth] 
    if (!isPublicRoute(request)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}