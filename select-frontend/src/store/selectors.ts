import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const selectOptions = (state: RootState) => state.options.items;
export const selectIsLoading = (state: RootState) => state.options.isLoading;
export const selectOptionsError = (state: RootState) => state.options.error;
export const selectSelectedValue = (state: RootState) => state.select.selectedValue;
export const selectMessages = (state: RootState) => state.select.messages;
export const selectIsSubmitting = (state: RootState) => state.select.isSubmitting;
export const selectLastResponse = (state: RootState) => state.api.lastResponse;
export const selectApiError = (state: RootState) => state.api.error;

export const selectFilteredOptions = createSelector(
  [selectOptions, selectSelectedValue],
  (options, selectedValue) => {
    if (!selectedValue) return options;
    return options.filter(option => option.value.includes(selectedValue));
  }
);

export const selectIsFormValid = createSelector(
  [selectSelectedValue, selectIsLoading],
  (selectedValue, isLoading) => {
    return !isLoading && !!selectedValue && selectedValue.trim() !== '';
  }
);

export const selectIsSubmitDisabled = createSelector(
  [selectIsSubmitting, selectIsLoading, selectSelectedValue],
  (isSubmitting, isLoading, selectedValue) => {
    return isSubmitting || isLoading || !selectedValue;
  }
);

export const selectAllMessages = createSelector(
  [selectMessages],
  (messages) => messages
);

export const selectHasMessages = createSelector(
  [selectMessages],
  (messages) => messages.length > 0
);

export const selectSelectedOption = createSelector(
  [selectOptions, selectSelectedValue],
  (options, selectedValue) => {
    if (!selectedValue) return null;
    return options.find(option => option.value === selectedValue) || null;
  }
);