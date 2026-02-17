import { randomBytes } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("Missing OAUTH_GITHUB_CLIENT_ID", { status: 500 });
  }

  const state = randomBytes(16).toString("hex");
  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/callback`;

  const githubUrl = new URL("https://github.com/login/oauth/authorize");
  githubUrl.searchParams.set("client_id", clientId);
  githubUrl.searchParams.set("redirect_uri", redirectUri);
  githubUrl.searchParams.set("scope", "repo,user");
  githubUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(githubUrl.toString(), 302);
  response.cookies.set("decap_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
  return response;
}
