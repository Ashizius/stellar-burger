import { SerializedError, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsThunk } from '../actions';

export interface IngredientsState {
  isInit: boolean;
  isLoading: boolean;
  ingredients: TIngredient[];
  error: SerializedError | null;
}

const initialState: IngredientsState = {
  isInit: false,
  isLoading: false,
  ingredients: [],
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (sliceState) => sliceState.ingredients,
    selectIngredientsLoading: (sliceState) => sliceState.isLoading,
    selectIngredientsInit: (sliceState) => sliceState.isInit,
    selectIngredientsError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsInit,
  selectIngredientsError
} = ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
