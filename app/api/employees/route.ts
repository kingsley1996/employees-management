import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { readJsonFile, writeJsonFile } from "@/utils";
import { v4 as uuid4 } from "uuid";

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

export async function POST(req: NextRequest) {
  try {
    const employeesData = readJsonFile(employeesFilePath);
    const employees = employeesData.data.pageItems;
    const body = await req.json();
    const newEmployee = {
      id: uuid4(),
      ...body,
    };

    employees.push(newEmployee);
    employeesData.data.pageItems = employees;

    const totalItems = employees.length;
    const pageSize = 10;
    const totalPages = Math.ceil(totalItems / pageSize);

    employeesData.data.totalItems = totalItems;
    employeesData.data.totalPages = totalPages;

    writeJsonFile(employeesFilePath, employeesData);

    return new NextResponse(
      JSON.stringify({
        message: "Employee created successfully",
        employee: newEmployee,
        data: {
          totalItems: totalItems,
          totalPages: totalPages,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("[CREATE_EMPLOYEES_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
