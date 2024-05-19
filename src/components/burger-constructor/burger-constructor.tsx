import { FC, useMemo } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearBurger,
  selectBurger
} from '../../services/slices/burgerConstructorSlice';
import {
  clearOrder,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/slices/orderBurgerSlice';
import { selectUserData } from '../../services/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderBurgerThunk } from '../../services/actions';

export const BurgerConstructor: FC = () => {
  const location = useLocation();
  const orderRequest = useSelector(selectOrderRequest);
  const constructorItems = useSelector(selectBurger);
  const orderModalData: TOrder | null = useSelector(selectOrderModalData);
  const user = useSelector(selectUserData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    dispatch(orderBurgerThunk(constructorItems)).then(() => {
      dispatch(clearBurger());
    });
  };
  const closeOrderModal = () => {
    if (!orderRequest) {
      dispatch(clearOrder());
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
