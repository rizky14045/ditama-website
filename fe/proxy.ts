import { NextResponse } from "next/server";

export default function proxy(request: any) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
