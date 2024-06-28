import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse("Invalid request: Missing employee id", {
        status: 400,
      });
    }
    const employee = await prisma.employee.findUnique({
      where: {
        id: params.id as string as string,
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

    if (!employee) {
      return new NextResponse("Employee not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify({ data: employee }));
  } catch (error) {
    console.error("[EMPLOYEES_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse("Invalid request: Missing employee id", {
        status: 400,
      });
    }

    await prisma.$transaction(async (prisma) => {
      // Delete all images related to the employee's tool languages
      await prisma.image.deleteMany({
        where: {
          toolLanguage: {
            position: {
              employeeId: params.id as string as string,
            },
          },
        },
      });

      // Delete all tool languages related to the employee's positions
      await prisma.toolLanguage.deleteMany({
        where: {
          position: {
            employeeId: params.id as string as string,
          },
        },
      });

      // Delete all positions related to the employee
      await prisma.position.deleteMany({
        where: {
          employeeId: params.id as string as string,
        },
      });

      // Finally, delete the employee
      await prisma.employee.delete({
        where: {
          id: params.id as string as string,
        },
      });
    });

    return new NextResponse(
      JSON.stringify({
        message: "Employee deleted successfully",
      })
    );
  } catch (error) {
    console.error("[DELETE_EMPLOYEE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse("Invalid request: Missing employee id", {
        status: 400,
      });
    }

    const body = await req.json();
    const { name, positions } = body;

    let updatedEmployee = null;

    await prisma.$transaction(async (prisma) => {
      // Delete existing positions, tool languages, and images for the employee
      await prisma.image.deleteMany({
        where: {
          toolLanguage: { position: { employeeId: params.id as string } },
        },
      });
      await prisma.toolLanguage.deleteMany({
        where: { position: { employeeId: params.id as string } },
      });
      await prisma.position.deleteMany({
        where: { employeeId: params.id as string },
      });

      // Update the employee and create new positions, tool languages, and images
      updatedEmployee = await prisma.employee.update({
        where: { id: params.id as string },
        data: {
          name,
          positions: {
            create: positions.map((position: any) => ({
              id: position.id,
              positionResourceId: position.positionResourceId,
              toolLanguages: {
                create: position.toolLanguages.map((toolLanguage: any) => ({
                  id: toolLanguage.id,
                  toolLanguageResourceId: toolLanguage.toolLanguageResourceId,
                  from: toolLanguage.from,
                  to: toolLanguage.to,
                  description: toolLanguage.description,
                  images: {
                    create: toolLanguage.images.map((image: any) => ({
                      id: image.id,
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
    });
    return new NextResponse(
      JSON.stringify({
        message: "Employee updated successfully",
        data: updatedEmployee
      })
    );
  } catch (error) {
    console.error("[UPDATE_EMPLOYEE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
