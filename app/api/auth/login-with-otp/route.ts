import { NextResponse } from "next/server";
import { authService } from "@/services";
import { AuthResponse, ErrorResponse } from "@/types";
import { API_CONFIG, VALIDATION } from "@/constants";

type LoginWithOtpRequestBody = {
  email: string;
  otp: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LoginWithOtpRequestBody>;
    const email = body.email?.trim();
    const otp = body.otp?.trim();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "OTP must be 6 digits" },
        { status: 400 }
      );
    }

    const apiBaseUrl = API_CONFIG.baseUrl;
    const targetUrl = `${apiBaseUrl}/auth/login-with-otp`;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ErrorResponse;
      return NextResponse.json(
        {
          message: errorData.message || "Invalid or expired OTP",
          errors: errorData.errors || [],
        },
        { status: response.status }
      );
    }

    const authData = data as AuthResponse;

    if (authData.data?.success && authData.data.tokens && authData.data.user) {
      // Store tokens and user data
      authService.setTokens(authData.data.tokens);
      authService.setUser(authData.data.user);

      return NextResponse.json({
        message: "Login successful",
        user: authData.data.user,
        tokens: authData.data.tokens,
      });
    }

    return NextResponse.json(
      { message: "Invalid response from authentication server" },
      { status: 502 }
    );
  } catch (error) {
    console.error("Login with OTP error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
