// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import CryptoJS from 'crypto-js';

// You should store your secret key securely (for decryption)
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || 'lhS7aOXRUPGPDId6mmHJdA00p39HAfU4';

export function middleware(req: NextRequest) {
  // Access the encrypted user cookie and access token
  const userCookie = req.cookies.get('user');
  const accessToken = req.cookies.get('access_token');

  // If no user or access token cookie, redirect to login
  if (!userCookie || !accessToken) {
    console.log("Redirecting to /login due to missing cookies.");
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    // Decrypt the user cookie
    const decryptedUserBytes = CryptoJS.AES.decrypt(userCookie.value, secretKey);
    const decryptedUser = JSON.parse(decryptedUserBytes.toString(CryptoJS.enc.Utf8));

    // Decrypt the access token (optional)
    const decryptedAccessTokenBytes = CryptoJS.AES.decrypt(accessToken.value, secretKey);
    const decryptedAccessToken = decryptedAccessTokenBytes.toString(CryptoJS.enc.Utf8);

    // Role-based routing
    if (decryptedUser.role === 'manager') {
      if (req.nextUrl.pathname.startsWith('/management')) {
        console.log("Manager logged in and accessing /management.");
        return NextResponse.next();
      } else {
        console.log("Redirecting to /management.");
        return NextResponse.redirect(new URL('/management/account', req.url));
      }
    }

    if (decryptedUser.role === 'customer') {
      if (req.nextUrl.pathname.startsWith('/customer')) {
        console.log("Customer logged in and accessing /customer.");
        return NextResponse.next();
      } else {
        console.log("Redirecting to /customer.");
        return NextResponse.redirect(new URL('/customer/account', req.url));
      }
    }
  } catch (error) {
    console.error("Error decrypting user cookie:", error);
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Fallback: Redirect to login if no valid role or unexpected scenario
  console.log("Redirecting to /login due to invalid role.");
  return NextResponse.redirect(new URL('/', req.url));
}

// Define routes that should invoke the middleware
export const config = {
  matcher: ['/management/:path*', '/customer/:path*'], // Apply middleware to specific routes
};
