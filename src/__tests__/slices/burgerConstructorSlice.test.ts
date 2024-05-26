import reducer from '../../services/slices/burgerConstructorSlice';
import * as sliceApi from '../../services/slices/burgerConstructorSlice';
import mockData from '../burger.json';
import { initialState } from '../../services/slices/burgerConstructorSlice';

const mockBurger = mockData.burger;

const mockDataDown = {
  bun: mockBurger.bun,
  ingredients: [
    mockBurger.ingredients[1],
    mockBurger.ingredients[0],
    mockBurger.ingredients[2]
  ]
};
const mockDataUp = {
  bun: mockBurger.bun,
  ingredients: [
    mockBurger.ingredients[0],
    mockBurger.ingredients[2],
    mockBurger.ingredients[1]
  ]
};
const mockDataRemoved1 = {
  bun: mockBurger.bun,
  ingredients: [mockBurger.ingredients[0], mockBurger.ingredients[2]]
};
const { id, ...newIngredient } = mockBurger.ingredients[1];

describe('Конструктор бургера. Тест:', () => {
  test('[#1]. Очистка', () => {
    const newState = reducer(mockBurger, sliceApi.clearBurger());
    expect(newState).toEqual(initialState);
  });

  test('[#2]. Добавить ингредиент', () => {
    const newState = reducer(
      mockDataRemoved1,
      sliceApi.addIngredient(newIngredient, id)
    );
    expect(newState).toEqual(mockDataUp);
  });

  test('[#3]. Добавить булку', () => {
    const newState = reducer(
      mockBurger,
      sliceApi.addIngredient(mockData.newBun, id)
    );
    expect(newState).toEqual({ ...mockBurger, bun: mockData.newBun });
  });

  test('[#4]. Удалить ингредиент', () => {
    const newState = reducer(
      mockBurger,
      sliceApi.removeIngredient(mockBurger.ingredients[1])
    );
    expect(newState).toEqual(mockDataRemoved1);
  });

  test('[#5]. Удалить ингредиент из пустого', () => {
    const newState = reducer(
      initialState,
      sliceApi.removeIngredient(mockBurger.ingredients[1])
    );
    expect(newState).toEqual(initialState);
  });

  test('[#6]. Удалить булку', () => {
    const newState = reducer(
      mockBurger,
      sliceApi.removeIngredient({ ...mockBurger.bun, id: '1' })
    );
    expect(newState).toEqual(mockBurger);
  });

  test('[#7]. Переместить выше', () => {
    const newState = reducer(
      mockBurger,
      sliceApi.moveIngredient({
        ingredient: mockBurger.ingredients[1],
        direction: 1
      })
    );
    expect(newState).toEqual(mockDataUp);
  });

  test('[#8]. Переместить выше последнего', () => {
    const newState = reducer(
      mockBurger,
      sliceApi.moveIngredient({
        ingredient: mockBurger.ingredients[2],
        direction: 1
      })
    );
    expect(newState).toEqual(mockBurger);
  });

  test('[#9]. Переместить ниже', () => {
    const newState = reducer(
      mockBurger,
      sliceApi.moveIngredient({
        ingredient: mockBurger.ingredients[1],
        direction: -1
      })
    );
    expect(newState).toEqual(mockDataDown);
  });

  test('[#10]. Переместить ниже первого', () => {
    const newState = reducer(
      mockBurger,
      sliceApi.moveIngredient({
        ingredient: mockBurger.ingredients[0],
        direction: -1
      })
    );
    expect(newState).toEqual(mockBurger);
  });
});
