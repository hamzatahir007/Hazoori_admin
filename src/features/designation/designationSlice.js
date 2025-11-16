import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import designationService from "./DesignationService";

export const getAllDesignation = createAsyncThunk(
  "designation/get-allDesignations",
  async (thunkAPI) => {
    try {
      return await designationService.getAllDesignation();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getDesignation = createAsyncThunk(
  "designation/get-designation",
  async (id, thunkAPI) => {
    try {
      return await designationService.getDesignation(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createNewDesignation = createAsyncThunk(
  "designation/create-designation",
  async (depData, thunkAPI) => {
    try {
      return await designationService.createNewDesignation(depData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getDesignationById = createAsyncThunk(
  "designation/get-designation",
  async (id, thunkAPI) => {
    try {
      return await designationService.getDesignationById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateDesignation = createAsyncThunk(
  "designation/update-designation",
  async (data, thunkAPI) => {
    try {
      return await designationService.updateDesignation(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteDesignation = createAsyncThunk(
  "designation/delete-designation",
  async (id, thunkAPI) => {
    try {
      return await designationService.deleteDesignationById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");


const initialState = {
  designation: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const designationSlice = createSlice({
  name: "designation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(getAllDesignation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDesignation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.designation = action.payload;
      })
      .addCase(getAllDesignation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(createNewDesignation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewDesignation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdDesignation = action.payload;
      })
      .addCase(createNewDesignation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getDesignationById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDesignationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.designation = action.payload;
      })
      .addCase(getDesignationById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateDesignation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedDesignation = action.payload;
      })
      .addCase(updateDesignation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteDesignation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedDesignation = action.payload;
      })
      .addCase(deleteDesignation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});
export default designationSlice.reducer;
