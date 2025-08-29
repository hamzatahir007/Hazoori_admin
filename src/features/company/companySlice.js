import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import companyService from "./companyService";

export const getCompany = createAsyncThunk(
  "company/get-companies",
  async (thunkAPI) => {
    try {
      return await companyService.getCompany();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createCompany = createAsyncThunk(
  "company/create-company",
  async (categoryData, thunkAPI) => {
    // console.log(categoryData,'yess');
    // return
    try {
      return await companyService.createCompany(categoryData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Something went wrong";
      // console.log('yess' , message , error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  "company/update-company",
  async (category, thunkAPI) => {
    try {
      return await companyService.updateCompany(category);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "company/delete-company",
  async (id, thunkAPI) => {
    try {
      return await companyService.deleteCompanyById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getCompanyById = createAsyncThunk(
  "company/get-companyById",
  async (id, thunkAPI) => {
    try {
      return await companyService.getCompanyById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const resetState = createAction("RevertAll");

const initialState = {
  company: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.company = action.payload;
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        // state.message = action.error;
        state.message = action.payload || action.error.message; // only strings
      })
      .addCase(createCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdCompany = action.payload;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedCompany = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedCompany = action.payload;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getCompanyById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.companyName = action.payload.name;
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});
export default companySlice.reducer;
