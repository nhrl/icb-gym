import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers'

// Define the payload type for the JWT
export interface SessionPayload {
  userId: number;
  name: string;
  email: string;
  expiresAt: Date;
}

const secretKey = process.env.SESSION_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

// Function to create and sign a JWT
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as JWTPayload)              
    .setProtectedHeader({ alg: 'HS256' })   
    .setIssuedAt()                          
    .setExpirationTime('7d')               
    .sign(encodedKey);                      
}

// Function to verify and decrypt a JWT
export async function decrypt(token: string = ''): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],                
    });
    return payload as unknown as SessionPayload;       
  } catch (error) {
    console.error('Failed to verify session:', error);
    return null;
  }
}

export async function createSession(userId: number) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({
        userId, expiresAt,
        name: '',
        email: ''
    })

    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
    return session;
}

export async function updateSession() {
    const session = cookies().get('session')?.value
    const payload = await decrypt(session)

    if (!session || !payload) {
        return null
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    })
}

export function deleteSession() {
    cookies().delete('session')
}