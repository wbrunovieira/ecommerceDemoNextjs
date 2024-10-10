import NextAuth from "next-auth";
import { nextAuthOptions } from "@/auth/nextAuthOptions";

const handler = NextAuth(nextAuthOptions);

export async function GET(req: Request) {
    return handler(req);
}

export async function POST(req: Request) {
    return handler(req);
}
