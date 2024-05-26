import store, { rootReducer } from '../../services/store';

const initialState = store.getState();

describe('Тест хранилища. Тест:', () => {
  test('[#1]. главный редьюсер', async () => {
    let action = { type: 'UNKNOWN_ACTION' };
    const newState = rootReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });
});
