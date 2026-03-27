import { NextResponse } from "next/server";
import { getInstagramFeed } from "@/lib/instagram";

export const revalidate = 1800;

export async function GET() {
  const data = await getInstagramFeed();
  return NextResponse.json(data);
}
