import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import departmentService from "./departmentService";

export const getAllDepartment = createAsyncThunk(
  "department/get-alldepartments",
  async (thunkAPI) => {
    try {
      return await departmentService.getAllDepartment();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getDepartment = createAsyncThunk(
  "department/get-department",
  async (id, thunkAPI) => {
    try {
      return await departmentService.getDepartment(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createNewDepartment = createAsyncThunk(
  "department/create-department",
  async (depData, thunkAPI) => {
    try {
      return await departmentService.createNewDepartment(depData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getDepartmentById = createAsyncThunk(
  "department/get-department",
  async (id, thunkAPI) => {
    try {
      return await departmentService.getDepartmentById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateDepartment = createAsyncThunk(
  "department/update-department",
  async (data, thunkAPI) => {
    try {
      return await departmentService.updateDepartment(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  "department/delete-department",
  async (id, thunkAPI) => {
    try {
      return await departmentService.deleteDepartmentById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");


const initialState = {
  department: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(getAllDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.department = action.payload;
      })
      .addCase(getAllDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(createNewDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdDepartment = action.payload;
      })
      .addCase(createNewDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getDepartmentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDepartmentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.department = action.payload;
      })
      .addCase(getDepartmentById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedDepartment = action.payload;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedDepartment = action.payload;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});
export default departmentSlice.reducer;
