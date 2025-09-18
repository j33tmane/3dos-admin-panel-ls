import { NextResponse } from "next/server";
import { API_CONFIG, VALIDATION } from "@/constants";

type SendOtpRequestBody = {
  email: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SendOtpRequestBody>;
    const email = body.email?.trim();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
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

    const apiBaseUrl = API_CONFIG.baseUrl;
    const targetUrl = `${apiBaseUrl}/auth/send-otp`;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to send OTP" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "OTP sent successfully",
      data: data.data,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
