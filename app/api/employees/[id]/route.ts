import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { readJsonFile, writeJsonFile } from "@/utils";

const employeesFilePath = path.join(process.cwd(), "data", "employees.json");
const pageSize = 10; // Assuming pageSize is fixed at 10

export async function DELETE(req: Request, { params } : { params: { id: string }}) {
  try {
    if (!params.id) {
      return new NextResponse("Invalid request: Missing employee id", {
        status: 400,
      });
    }
    const employeesData = readJsonFile(employeesFilePath);
    let employees = employeesData.data.pageItems;

    // Find index of employee to delete
    const index = employees.findIndex(
      (employee: any) => employee.id === parseInt(params.id, 10)
    );

    if (index === -1) {
      return new NextResponse("Employee not found", { status: 404 });
    }

    // Remove employee from array
    employees.splice(index, 1);

    // Calculate totalItems and totalPages
    const totalItems = employees.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Update employeesData with new values
    employeesData.data.totalItems = totalItems;
    employeesData.data.totalPages = totalPages;
    employeesData.data.pageItems = employees;

    // Save updated data back to JSON file
    writeJsonFile(employeesFilePath, employeesData);

    return new NextResponse(
      JSON.stringify({
        data: {
          totalItems: totalItems,
          totalPages: totalPages,
          pageItems: employees,
        },
      })
    );
  } catch (error) {
    console.error("[EMPLOYEES_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
