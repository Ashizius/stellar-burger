import * as actionsApi from '../../services/actions';
import store from '../../services/store';

import reducer from '../../services/slices/ingredientsSlice';
import * as sliceApi from '../../services/slices/ingredientsSlice';
import mockData from '../ingredients.json';

import unsuccessResponse from '../unsuccessResponse.json'
const globalFetch = global.fetch;
afterAll(() => {
  global.fetch = globalFetch;
});
const initialState = sliceApi.initialState;

const expectedResult = mockData.data;
const testedThunk = actionsApi.getIngredientsThunk;
const getCurrentStorePart = () => store.getState().ingredients;
const loadingState = Object.assign({}, initialState, { isLoading: true });
const fulfilledState = Object.assign({}, initialState, { isInit: true });
const appliedState = Object.assign({}, fulfilledState, {
  ingredients: expectedResult
});
const failedState = Object.assign({}, fulfilledState, {
  error: unsuccessResponse
});

describe('Cлайс с ингредиентами. Тест:', () => {
  test('[#1]. Запрос на эндпоинт', async () => {
    const newState = reducer(initialState, testedThunk.pending(''));
    expect(newState).toEqual(loadingState);
  });
  
  test('[#2]. Результат запроса', async () => {
    const newState = reducer(
      loadingState,
      testedThunk.fulfilled(expectedResult, '')
    );
    expect(newState).toEqual(appliedState);
  });

  test('[#3]. Ошибка запроса', () => {
    const newState = reducer(
      loadingState,
      testedThunk.rejected(unsuccessResponse, '')
    );
    expect(newState).toEqual(failedState);
  });

  test('[#4]. успешный диспатч', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData)
      })
    ) as jest.Mock;
    await store.dispatch(testedThunk());
    expect(getCurrentStorePart()).toEqual(appliedState);
  });
  
  test('[#5]. ошибка загрузки с сервера', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(unsuccessResponse)
      })
    ) as jest.Mock;
    await store.dispatch(testedThunk());
    expect(getCurrentStorePart()).toEqual(failedState);
  });
});
