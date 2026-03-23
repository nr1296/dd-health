import { NextResponse } from "next/server";

/** Wraps an API route handler and catches unhandled errors with a consistent 500 response. */
export function apiHandler(
  handler: (req: Request) => Promise<NextResponse>
) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (err) {
      console.error("[API Error]", err);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  };
}
