import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import shiftService from "./shiftsService";

export const getAllShifts = createAsyncThunk(
  "designation/get-allShifts",
  async (thunkAPI) => {
    try {
      return await shiftService.getAllShifts();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getShiftsByCompany = createAsyncThunk(
  "designation/get-CompanyShifts",
  async (id, thunkAPI) => {
    try {
      return await shiftService.getShiftsByCompany(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createNewShift = createAsyncThunk(
  "designation/create-shift",
  async (depData, thunkAPI) => {
    try {
      return await shiftService.createNewShift(depData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getShiftById = createAsyncThunk(
  "designation/get-shift",
  async (id, thunkAPI) => {
    try {
      return await shiftService.getShiftById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateShift = createAsyncThunk(
  "designation/update-shift",
  async (data, thunkAPI) => {
    try {
      return await shiftService.updateShift(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteShiftById = createAsyncThunk(
  "designation/delete-shift",
  async (id, thunkAPI) => {
    try {
      return await shiftService.deleteShiftById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");


const initialState = {
  shift: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const designationSlice = createSlice({
  name: "shift",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(getAllShifts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllShifts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.shift = action.payload;
      })
      .addCase(getAllShifts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(createNewShift.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewShift.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdShift = action.payload;
      })
      .addCase(createNewShift.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getShiftsByCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShiftsByCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.shift = action.payload;
      })
      .addCase(getShiftsByCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateShift.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateShift.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedShift = action.payload;
      })
      .addCase(updateShift.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteShiftById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteShiftById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedShift = action.payload;
      })
      .addCase(deleteShiftById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});
export default designationSlice.reducer;
