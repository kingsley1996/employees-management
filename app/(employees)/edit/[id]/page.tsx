"use client";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  deleteEmployeeById,
  getEmployeeById,
  updateEmployeeById,
} from "@/lib/features/employees/employeeSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FieldArrayPositions } from "@/components/FieldArrayPositions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { v4 as uuid4 } from "uuid";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import NotFound from "@/components/NotFoundEmployee";
import Loading from "@/components/LoadingPage";
import { useUploadImageContext } from "@/app/context/UploadImageContext";

const EmployeeFormSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  positions: z
    .array(
      z.object({
        positionResourceId: z.string().min(1, "Position is required"),
        // displayOrder: z.number(),
        id: z.string(),
        toolLanguages: z
          .array(
            z
              .object({
                id: z.string(),
                toolLanguageResourceId: z
                  .string()
                  .min(1, "Tool/Languages is required"),
                //   displayOrder: z.number(),
                from: z.string().min(1, "From year is required"),
                to: z.string().min(1, "To year is required"),
                description: z.string().min(1, "Description is required"),
                images: z
                  .array(
                    z.object({
                      id: z.string(),
                      cdnUrl: z.string().min(1, "Image is required"),
                      // displayOrder: z.number(),
                    })
                  )
                  .min(1, "At least one image selected"),
              })
              .refine(
                (schema) => {
                  return parseInt(schema.from) < parseInt(schema.to);
                },
                {
                  message: "The year to must be greater than the year from",
                  path: ["to"],
                }
              )
          )
          .min(1, "At least one tool/language selected"),
      })
    )
    .min(1, "At least one position selected"),
});

export type IEditEmployeeForm = z.infer<typeof EmployeeFormSchema>;

const defaultValues = {
  name: "",
  positions: [
    {
      id: uuid4(),
      positionResourceId: "",
      toolLanguages: [
        {
          id: uuid4(),
          toolLanguageResourceId: "",
          from: "2023",
          to: "2024",
          description: "",
          images: [{ id: uuid4(), cdnUrl: "" }],
        },
      ],
    },
  ],
};

export default function CreateEmployeeForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [notFound, setNotFound] = useState(false);
  const { isUploading } = useUploadImageContext();

  const {
    loading,
    loadingPositionResources,
    loadingSubmit,
    loadingDelete,
    editEmployee,
  } = useAppSelector((state: RootState) => state.employees);

  const methods = useForm<IEditEmployeeForm>({
    defaultValues: defaultValues,
    resolver: zodResolver(EmployeeFormSchema),
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const fetchEmployee = async () => {
      if (id) {
        try {
          const result = await dispatch(getEmployeeById(id));
          if (!result.payload) {
            setNotFound(true);
          }
        } catch (error) {
          setNotFound(true);
        }
      }
    };
    fetchEmployee();
  }, [id, dispatch]);

  useEffect(() => {
    if (editEmployee?.id) {
      setValue("name", editEmployee.name);
      setValue("positions", editEmployee.positions);
    }
  }, [editEmployee, setValue]);

  const onSubmit = async (data: any) => {
    const { positions, name } = data;
    try {
      await dispatch(updateEmployeeById({ id, positions, name }));
      toast.success("Employee updated successfully!", {
        autoClose: 300,
      });
      setTimeout(() => {
        router.push("/");
      }, 300);
    } catch (error) {
      toast.error("Failed to update employee!");
    }
  };

  const onValid = (e: any) => {
    console.log("errors: ", e);
  };

  const handleCancelEdit = () => {
    router.push("/");
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await dispatch(deleteEmployeeById({ id, triggerGetData: false }));
        toast.success("Deleted employee", {
          autoClose: 300,
        });
        setTimeout(() => {
          router.push("/");
        }, 300);
      } catch (error) {
        toast.error("Failed to delete employee!");
      }
    }
  };

  if (
    loading === "pending" ||
    loading === "idle" ||
    loadingPositionResources === "pending"
  ) {
    return <Loading />;
  }

  if (notFound) {
    return <NotFound />;
  }

  return (
    <div className="w-full md:w-2/3 p-8 md:p-12">
      <div className="flex items-center mb-8">
        <Link href="/">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-md md:text-2xl font-bold ml-4">
          Edit Employee Form
        </h1>
      </div>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onValid)}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                {...register("name")}
                placeholder="Employee name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
              />
              {errors.name && (
                <p className="text-red-500 text-xs italic">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <FieldArrayPositions isEdit={true} />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleDelete}
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  loadingDelete === "pending"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {loadingDelete === "pending" ? "Deleting..." : "Delete"}
              </button>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingSubmit === "pending" || isUploading}
                  className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    (loadingSubmit === "pending" || isUploading)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loadingSubmit === "pending" ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
