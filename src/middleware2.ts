import { NextResponse, type NextRequest } from "next/server";

const raw = process.env.ALLOWED_ORIGINS?.trim();
const allowedOrigins = raw ? new Set(raw.split(",").map((s) => s.trim()))
: null;

const DEFAULT_METHODS = ["GET","POST","OPTIONS"].join(", ");

const DEFAULT_HEADERS = [
    "Content-Type",
    "X-Requested-With",
    "x-api-key",
    "Authorization",
    ].join(", ");

function decideOrigin(origin?: string | null){
    if (!origin) return null;
    if (!allowedOrigins) return null;
    return allowedOrigins.has(origin) ? origin : null;
}

function withCors(req: NextRequest, res: NextResponse){
    const origin = req.headers.get("origin");
    const allowOrigin = decideOrigin(origin);

    if(allowedOrigins && origin && !allowOrigin){
        //origin not allowed, return 403 forbidden
        return new NextResponse(JSON.stringify({ error: "Origin not allowed"}), {
         status: 403,
         headers: { "Content-Type": "application/json"},
         });
    }

    if (allowOrigin){
        res.headers.set("Access-Control-Allow-Origin", allowOrigin);
        res.headers.set("Vary", "Origin");
        //allow credentials if need (cookies, auth headers)
        res.headers.set("Access-Control-Allow-Credentials", "true");
        res.headers.set("Access-Control-Allow-Methods", DEFAULT_METHODS);
        res.headers.set("Access-Control-Allow-Headers", DEFAULT_HEADERS);
        res.headers.set("Access-Control-Max-Age", "600"); //cache preflight response for 10 minutes

        res.headers.set(
         "Access-Control-Expose-Headers",
         ["Retry-After", "X-RateLimit-Limit", "X-RateLimit-Remaining"].join(", "),
        );
    }

    return res;
}

export function middleware2(req: NextRequest){
    if (req.method === "OPTIONS") {
        //Preflight request
      const res = new NextResponse(null, {status: 204});
      return withCors(req,res);
    }

    const res = NextResponse.next();
    return withCors(req,res);
}


export const config = {
    matcher: ["/api/:path*"],
}