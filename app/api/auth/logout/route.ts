import { NextResponse } from "next/server";
import { authService } from "@/services";

export async function POST() {
  try {
    // Clear tokens and user data from localStorage
    authService.clearTokens();

    return NextResponse.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
