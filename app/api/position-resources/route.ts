import { NextResponse } from "next/server";
import path from "path";
import { readJsonFile, writeJsonFile } from "@/utils";

const positionResourcesFilePath = path.join(process.cwd(), "tmp", "positionResources.json");

export async function GET() {
  try {
    const positionResourcesData = readJsonFile(positionResourcesFilePath);
    return new NextResponse(JSON.stringify({ data: positionResourcesData.data }));
  } catch (error) {
    console.error("[POSITION_RESOURCES_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
