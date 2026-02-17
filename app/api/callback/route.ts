import { NextResponse, type NextRequest } from "next/server";

function callbackHtml(message: string): string {
  return `<!doctype html>
<html>
  <body>
    <script>
      (function () {
        var finalMessage = ${JSON.stringify(message)};

        function complete(targetOrigin) {
          if (!window.opener) return;
          window.opener.postMessage(finalMessage, targetOrigin || "*");
          setTimeout(function () {
            window.close();
          }, 80);
        }

        function receiveMessage(event) {
          complete(event && event.origin ? event.origin : "*");
        }

        if (window.opener) {
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");

          // Fallback for clients that don't send ack messages.
          setTimeout(function () {
            complete("*");
          }, 1200);
        } else {
          document.body.textContent = "Authentication window missing opener.";
        }

        // Safety fallback: if popup blockers prevent close, keep a visible status.
        setTimeout(function () {
          if (!document.body.textContent) {
            document.body.textContent = "Authentication completed. You can close this window.";
          }
        }, 1500);
      })();
    </script>
  </body>
</html>`;
}

export async function GET(request: NextRequest) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new NextResponse("Missing GitHub OAuth environment variables", { status: 500 });
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");
  const savedState = request.cookies.get("decap_oauth_state")?.value;

  if (error) {
    return new NextResponse(callbackHtml(`authorization:github:error:${error}`), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  if (!code || !state || !savedState || state !== savedState) {
    return new NextResponse(callbackHtml("authorization:github:error:invalid_state"), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const redirectUri = `${request.nextUrl.origin}/api/callback`;
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "degreepath-decap-oauth",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      state,
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  const tokenPayload = (await tokenResponse.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenPayload.access_token) {
    const detail = tokenPayload.error_description || tokenPayload.error || "token_exchange_failed";
    return new NextResponse(callbackHtml(`authorization:github:error:${detail}`), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const successMessage = `authorization:github:success:${JSON.stringify({
    token: tokenPayload.access_token,
  })}`;

  const response = new NextResponse(callbackHtml(successMessage), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
  response.cookies.delete("decap_oauth_state");
  return response;
}
