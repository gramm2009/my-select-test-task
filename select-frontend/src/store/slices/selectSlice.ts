import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectState } from '../types';

const initialState: SelectState = {
  selectedValue: '',
  isSubmitting: false,
  messages: [],
};

const selectSlice = createSlice({
  name: 'select',
  initialState,
  reducers: {
    selectOption: (state, action: PayloadAction<string>) => {
      state.selectedValue = action.payload;
      state.messages = [];
    },
    
    clearSelection: (state) => {
      state.selectedValue = '';
      state.messages = [];
    },
    
    setMessages: (state, action: PayloadAction<string[]>) => {
      state.messages = action.payload;
    },
    
    addMessage: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    },
    
    clearMessages: (state) => {
      state.messages = [];
    },
    
    startSubmitting: (state) => {
      state.isSubmitting = true;
    },
    
    finishSubmitting: (state) => {
      state.isSubmitting = false;
    }
  }
});

export const { 
  selectOption, 
  clearSelection, 
  setMessages, 
  addMessage, 
  clearMessages,
  startSubmitting,
  finishSubmitting
} = selectSlice.actions;

export default selectSlice.reducer;