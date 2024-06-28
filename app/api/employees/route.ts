import { NextResponse, NextRequest } from "next/server";
import { v4 as uuid4 } from "uuid";
import prisma from "@/lib/prismadb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    let search = searchParams.get("search") || "";
    let pageNumber = Number(searchParams.get("pageNumber") || 1);
    let pageSize = Number(searchParams.get("pageSize") || 10);
    const skip = (pageNumber - 1) * pageSize;
    const searchQuery = (search as string).toLowerCase();

    const totalItems = await prisma.employee.count({
      where: {
        name: {
          contains: searchQuery,
        },
      },
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    // Fetch employees with search criteria and pagination
    const employees = await prisma.employee.findMany({
      skip: skip,
      take: pageSize,
      where: {
        name: {
          contains: searchQuery,
        },
      },
      include: {
        positions: {
          include: {
            toolLanguages: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: {
          totalItems,
          totalPages,
          pageItems: employees,
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
    const body = await req.json();
    const { name, positions } = body;

    const employeeId = uuid4();

    const newEmployee = await prisma.employee.create({
      data: {
        id: employeeId,
        name,
        positions: {
          create: positions.map((position: any) => ({
            positionResourceId: position.positionResourceId,
            toolLanguages: {
              create: position.toolLanguages.map((toolLanguage: any) => ({
                toolLanguageResourceId: toolLanguage.toolLanguageResourceId,
                from: toolLanguage.from,
                to: toolLanguage.to,
                description: toolLanguage.description,
                images: {
                  create: toolLanguage.images.map((image: any) => ({
                    cdnUrl: image.cdnUrl,
                  })),
                },
              })),
            },
          })),
        },
      },
      include: {
        positions: {
          include: {
            toolLanguages: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(newEmployee), { status: 201 });
  } catch (error) {
    console.error("[CREATE_EMPLOYEES_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
