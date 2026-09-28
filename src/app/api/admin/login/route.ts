import { NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@travelpartnerktm.in";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const isValidEmail = email === ADMIN_EMAIL || email === "admin@travelpartner.com";
    if (isValidEmail && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        message: "Authentication successful",
        token: `auth-${Date.now()}`,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Authentication server error" },
      { status: 500 }
    );
  }
}
