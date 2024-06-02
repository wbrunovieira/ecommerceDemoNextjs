import NextAuth from "next-auth";
import { nextAuthOptions } from "@/auth/nextAuthOptions";

const handler = NextAuth(nextAuthOptions);

export const GET = handler;
export const POST = handler;

export { nextAuthOptions };