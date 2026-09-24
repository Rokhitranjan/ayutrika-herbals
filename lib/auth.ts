import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "ayutrika_luxury_botanical_jwt_secret_key_2026_super_secure";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@ayutrika.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Ayutrika@Admin2026!";

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  role: "admin" | "customer";
}

export function signToken(payload: AuthSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthSession;
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function getAdminSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ayutrika_admin_token")?.value;
    if (!token) return null;
    const session = verifyToken(token);
    if (session && session.role === "admin") {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCustomerSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ayutrika_customer_token")?.value;
    if (!token) return null;
    const session = verifyToken(token);
    if (session && (session.role === "customer" || session.role === "admin")) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (!password || password.length < 6) {
    return { valid: false, message: "Password must contain at least 6 characters." };
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain both letters and numbers." };
  }
  return { valid: true };
}

export function validateIndianPostalCode(code: string): boolean {
  return /^[1-9][0-9]{5}$/.test(code.trim());
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, maxAttempts: number = 15, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= maxAttempts) {
    return false;
  }
  entry.count++;
  return true;
}

export async function verifyAdminCredentials(email: string, pass: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
    return true;
  }
  return false;
}
