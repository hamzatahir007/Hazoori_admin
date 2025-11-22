import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import employeeService from "./employeeService";

export const getEmployees = createAsyncThunk(
  "employee/get-employees",
  async (user, thunkAPI) => {
    try {
      return await employeeService.getEmployees(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createEmployee = createAsyncThunk(
  "employee/create-employee",
  async (categoryData, thunkAPI) => {
    // console.log(categoryData,'yess');
    // return
    try {
      return await employeeService.createEmployee(categoryData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Something went wrong";
      // console.log('yess' , message , error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employee/update-employee",
  async (category, thunkAPI) => {
    try {
      return await employeeService.updateEmployee(category);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employee/delete-employee",
  async (id, thunkAPI) => {
    try {
      return await employeeService.deleteEmployeeById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getEmployeeById = createAsyncThunk(
  "employee/get-employeeById",
  async (id, thunkAPI) => {
    try {
      return await employeeService.getEmployeeById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getEmployeesByCompany = createAsyncThunk(
  "employee/get-employeesByCompany",
  async (id, thunkAPI) => {
    try {
      return await employeeService.getEmployeesByCompany(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("RevertAll");

const initialState = {
  employee: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const companySlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.employee = action.payload;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        // state.message = action.error;
        state.message = action.payload || action.error.message; // only strings
      })
      .addCase(createEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdEmployee = action.payload;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedEmployee = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deleteEmployee = action.payload;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getEmployeeById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.employee = action.payload.name;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getEmployeesByCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployeesByCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.employee = action.payload;
      })
      .addCase(getEmployeesByCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});
export default companySlice.reducer;
