import axios from "axios";
import { Position } from "@/constants/employees";

const createApi = (contentType: string = "application/json") => {
  return axios.create({
    headers: {
      "Content-Type": contentType,
    },
  });
};

export const getEmployees = async (
  searchTerm: string,
  pageNumber: number,
  pageSize: number
) => {
  const api = createApi();
  const response = await api.get(
    `/api/employees?search=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return response.data;
};

export const getPositionResources = async () => {
  const api = createApi();
  const response = await api.get("/api/position-resources");
  return response.data;
};

export const deleteEmployee = async (id: string) => {
    const api = createApi();
    const response = await api.delete(`/api/employees/${id}`);
    return response.data;
}

export const createEmployeeApi = async (positions: Position[], name: string) => {
  const api = createApi("multipart/form-data");
  const formData = new FormData();

  formData.append("name", name);

  positions.forEach((position, index) => {
    Object.entries(position).forEach(([key, value]) => {
      if (key !== "toolLanguages") {
        formData.append(`positions[${index}][${key}]`, value);
      }
    });

    position.toolLanguages.forEach((toolLanguage, tlIndex) => {
      formData.append(
        `positions[${index}][toolLanguages][${tlIndex}][description]`,
        "test description"
      );

      Object.entries(toolLanguage).forEach(([tlKey, tlValue]) => {
        if (tlKey !== "images") {
          formData.append(
            `positions[${index}][toolLanguages][${tlIndex}][${tlKey}]`,
            tlValue
          );
        }
      });

      toolLanguage.images?.forEach((image, imgIndex) => {
        Object.entries(image).forEach(([imgKey, imgValue]) => {
          formData.append(
            `positions[${index}][toolLanguages][${tlIndex}][images][${imgIndex}][${imgKey}]`,
            imgValue
          );
        });
      });
    });
  });

  const response = await api.post("/employees", formData);
  return response.data;
};
