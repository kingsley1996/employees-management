"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { createEmployee } from "@/lib/features/employees/employeeSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FieldArrayPositions } from "@/components/FieldArrayPositions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { v4 as uuid4 } from "uuid";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export type ICreateEmployeeForm = z.infer<typeof EmployeeFormSchema>;

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

  const { loading, loadingSubmit } = useAppSelector(
    (state: RootState) => state.employees
  );

  const methods = useForm<ICreateEmployeeForm>({
    defaultValues: defaultValues,
    resolver: zodResolver(EmployeeFormSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      await dispatch(createEmployee(data));
      toast.success("Employee created successfully!", {
        autoClose: 300,
      });
      setTimeout(() => {
        router.push("/");
      }, 300);
    } catch (error) {
      toast.error("Failed to create employee!");
    }
  };

  const onValid = (e: any) => {
    console.log("errors: ", e);
  };

  return (
    <div className="w-full md:w-2/3 p-8 md:p-12">
      <div className="flex items-center mb-8">
        <Link href="/">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-md md:text-2xl font-bold ml-4">
          Create Employee Form
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
                placeholder="Employee name"
                {...register("name")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
              />
              {errors.name && (
                <p className="text-red-500 text-xs italic">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <FieldArrayPositions />
            </div>
            <button
              type="submit"
              disabled={loadingSubmit === "pending"}
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loadingSubmit === "pending"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {loadingSubmit === "pending" ? "Submitting..." : "Submit"}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
