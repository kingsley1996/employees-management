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
};

export const getEmployeeByIdApi = async (id: string) => {
  const api = createApi();
  const response = await api.get(`/api/employees/${id}`);
  return response.data;
};

export const createEmployeeApi = async (
  positions: Position[],
  name: string
) => {
  const api = createApi();
  const response = await api.post("/api/employees", { name, positions });
  return response.data;
};

export const updateEmployeeApi = async (
  id: string,
  positions: Position[],
  name: string
) => {
  const api = createApi();
  const response = await api.put(`/api/employees/${id}`, { name, positions });
  return response.data;
};
