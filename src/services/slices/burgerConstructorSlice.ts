import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { newId } from '../../utils/utils';
import { orderBurgerApi } from '@api';

export type TBurger = {
  bun: null | TIngredient;
  ingredients: TConstructorIngredient[];
};

export const initialState: TBurger = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    clearBurger: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    addIngredient: {
      reducer: (
        state,
        action: PayloadAction<TConstructorIngredient | TIngredient>
      ) => {
        if ('id' in action.payload) {
          state.ingredients.push(action.payload);
        } else {
          state.bun = action.payload;
        }
      },
      prepare: (ingredient: TIngredient, id: string) => ({
        payload: ingredient.type === 'bun' ? ingredient : { ...ingredient, id }
      })
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter((ingredient) => {
        if (action.payload.type === 'bun') {
          return true;
        }
        return action.payload.id !== ingredient.id;
      });
    },
    moveIngredient: (
      state,
      action: PayloadAction<{
        direction: number;
        ingredient: TConstructorIngredient;
      }>
    ) => {
      const index = state.ingredients.reduce(
        (place: null | number, ingredient, index) =>
          ingredient.id === action.payload.ingredient.id ? index : place,
        null
      );
      if (index !== null) {
        let newPosition = index + action.payload.direction;
        if (newPosition > state.ingredients.length - 1) {
          newPosition = state.ingredients.length - 1;
        } else if (newPosition < 0) {
          newPosition = 0;
        }
        if (newPosition !== index) {
          const tIngredient = state.ingredients[index];
          state.ingredients[index] = state.ingredients[newPosition];
          state.ingredients[newPosition] = tIngredient;
        }
      }
    }
  },
  selectors: {
    selectBurger: (sliceState) => sliceState
  }
});

export const { selectBurger } = burgerConstructorSlice.selectors;
export const { clearBurger, addIngredient, removeIngredient, moveIngredient } =
  burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
