import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../types';
import config from '../../config.json';

export const submitSelectedOption = createAsyncThunk(
  'api/submitSelectedOption',
  async (value: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.submitOption}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      return data;
    } catch (error) {
      if(error instanceof Error){
        return rejectWithValue(error.message || 'Ошибка отправки данных');
      };
      return rejectWithValue('Неизвестная ошибка отправки данных');
    }
  }
);

const apiSlice = createSlice({
  name: 'api',
  initialState: {
    lastResponse: null as ApiResponse | null,
    error: null as string | null,
  },
  reducers: {
    clearApiError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSelectedOption.fulfilled, (state, action) => {
        state.lastResponse = action.payload;
        state.error = null;
      })
      .addCase(submitSelectedOption.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { clearApiError } = apiSlice.actions;
export default apiSlice.reducer;