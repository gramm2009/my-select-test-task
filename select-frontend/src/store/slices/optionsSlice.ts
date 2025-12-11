import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CustomSelectOption } from '../types';
import config from '../../config.json';

export const fetchOptions = createAsyncThunk(
  'options/fetchOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.getOptions}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        return data.filter((item): item is CustomSelectOption => 
          item && 
          typeof item === 'object' && 
          'name' in item && 
          'value' in item &&
          typeof item.name === 'string' && 
          typeof item.value === 'string'
        );
      }
      
      return [];
    } catch (error) {
      if(error instanceof Error){
        return rejectWithValue('Ошибка загрузки опций');
      };
      return rejectWithValue('Неизвестная ошибка отправки данных');
    }
  }
);

const optionsSlice = createSlice({
  name: 'options',
  initialState: {
    items: [] as CustomSelectOption[],
    isLoading: false,
    error: null as string | null,
    warningMessage: null as string | null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.warningMessage = null;
      })
      .addCase(fetchOptions.fulfilled, (state, action: PayloadAction<CustomSelectOption[]>) => {
        state.isLoading = false;
        state.items = action.payload;
        state.warningMessage = null;
        
        if (action.payload.length === 0) {
          state.items = []
          state.warningMessage = 'Ошибка получения данных! Обновите страницу.'
        }
      })
      .addCase(fetchOptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        
        state.items = []
      });
  }
});

export const { clearError } = optionsSlice.actions;
export default optionsSlice.reducer;