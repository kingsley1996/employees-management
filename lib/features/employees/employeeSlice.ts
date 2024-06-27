"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEmployees,
  getPositionResources,
  deleteEmployee,
  getEmployeeByIdApi,
  createEmployeeApi,
  updateEmployeeApi
} from "../../api/employeesApi";
import { Position } from "@/constants/employees";

interface Employee {
  id: string;
  name: string;
  positions: any[];
}

interface PositionResource {
  positionResourceId: string;
  toolLanguageResources: ToolLanguageResource[];
  name: string;
}

export interface ToolLanguageResource {
  toolLanguageResourceId: string;
  positionResourceId: string;
  name: string;
  experience?: number;
}

interface EmployeesState {
  editEmployee: Employee;
  employees: Employee[];
  positionResources: PositionResource[];
  toolLanguageResources: ToolLanguageResource[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  loadingPositionResources: "idle" | "pending" | "succeeded" | "failed";
  loadingSubmit: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  totalItems: number;
  totalPages: number;
}

interface FetchEmployeesParams {
  search: string;
  pageNumber: number;
  pageSize: number;
  append: boolean;
}

interface CreateEmployeeParams {
  name: string;
  positions: Position[];
}

interface EditEmployeeParams {
  id: string;
  name: string;
  positions: Position[];
}

const initialState: EmployeesState = {
  editEmployee: null,
  employees: [],
  positionResources: [],
  toolLanguageResources: [],
  totalItems: 0,
  totalPages: 1,
  loading: "idle",
  loadingPositionResources: "idle",
  loadingSubmit: "idle",
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (params: FetchEmployeesParams, { getState }) => {
    const { search, pageNumber, pageSize, append } = params;
    try {
      const response = await getEmployees(search, pageNumber, pageSize);
      return { response, append };
    } catch (error) {
      throw Error("Failed to fetch employees");
    }
  }
);

export const fetchPositionResources = createAsyncThunk(
  "employees/fetchPositionResources",
  async () => {
    const response = await getPositionResources();
    return response;
  }
);

export const deleteEmployeeById = createAsyncThunk(
  "employees/deleteEmployeeById",
  async (id: string) => {
    const response = await deleteEmployee(id);
    return response;
  }
);

export const getEmployeeById = createAsyncThunk(
  "employees/getEmployeeById",
  async (id: string) => {
    const response = await getEmployeeByIdApi(id);
    return response;
  }
);

export const updateEmployeeById = createAsyncThunk(
  "employees/updateEmployeeById",
  async (params: EditEmployeeParams) => {
    const { id, name, positions } = params;
    const response = await updateEmployeeApi(id, positions, name);
    return response;
  }
);

export const createEmployee = createAsyncThunk(
    "employees/createEmployee",
    async (params: CreateEmployeeParams, { getState }) => {
      const { name, positions } = params;
      try {
        const response = await createEmployeeApi(positions, name);
        return { response };
      } catch (error) {
        throw Error("Failed to fetch employees");
      }
    }
  );

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = "succeeded";
        if (action.payload.append) {
          state.employees = [
            ...state.employees,
            ...action.payload.response.data.pageItems,
          ];
        } else {
          state.employees = action.payload.response.data.pageItems;
          state.totalItems = action.payload.response.data.totalItems;
          state.totalPages = action.payload.response.data.totalPages;
        }
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || null;
      })

      .addCase(fetchPositionResources.pending, (state) => {
        state.loadingPositionResources = "pending";
      })
      .addCase(fetchPositionResources.fulfilled, (state, action) => {
        state.loadingPositionResources = "succeeded";
        state.positionResources = action.payload.data;
      })
      .addCase(fetchPositionResources.rejected, (state, action) => {
        state.loadingPositionResources = "failed";
        state.error = action.error.message || null;
      })

      .addCase(deleteEmployeeById.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteEmployeeById.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.employees = action.payload.data.pageItems;
        state.totalItems = action.payload.data.totalItems;
        state.totalPages = action.payload.data.totalPages;
      })
      .addCase(deleteEmployeeById.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || null;
      })

      .addCase(createEmployee.pending, (state) => {
        state.loading = "pending";
        state.loadingSubmit = "pending";
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.loadingSubmit = "succeeded";
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = "failed";
        state.loadingSubmit = "failed";
        state.error = action.error.message || null;
      })

      .addCase(getEmployeeById.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.editEmployee = action.payload.data;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || null;
      })

      .addCase(updateEmployeeById.pending, (state) => {
        state.loadingSubmit = "pending";
      })
      .addCase(updateEmployeeById.fulfilled, (state, action) => {
        state.loadingSubmit = "succeeded";
      })
      .addCase(updateEmployeeById.rejected, (state, action) => {
        state.loadingSubmit = "failed";
        state.error = action.error.message || null;
      })
  },
});

export default employeeSlice.reducer;
