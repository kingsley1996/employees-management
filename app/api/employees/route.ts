import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { readJsonFile, writeJsonFile } from "@/utils";
import { useSearchParams } from "next/navigation";

const employeesFilePath = path.join(process.cwd(), "data", "employees.json");

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    let search = searchParams.get("search") || "";
    let pageNumber = Number(searchParams.get("pageNumber") || 1);
    let pageSize = Number(searchParams.get("pageSize") || 10);
    const employeesData = readJsonFile(employeesFilePath);
    let employees = employeesData.data.pageItems;

    const filtered = employees.filter((employee: any) =>
      employee.name.toLowerCase().includes(search.toLowerCase())
    );
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    debugger;

    return new NextResponse(
      JSON.stringify({
        data: {
          totalItems: filtered.length,
          totalPages: Math.ceil(filtered.length / pageSize),
          pageItems: paginated,
        },
      })
    );
  } catch (error) {
    console.error("[EMPLOYEES_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}