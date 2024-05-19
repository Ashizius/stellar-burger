import { FC, useLayoutEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectViewOrder,
  selectViewOrderLoading,
  selectViewOrderNumber
} from '../../services/slices/ordersListSlice';
import { useParams } from 'react-router-dom';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { viewOrderThunk } from '../../services/actions';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const param = useParams<{ number: string }>();
  const paramNumber = Number.parseInt(param.number ? param.number : '');
  const orderNumber = useSelector(selectViewOrderNumber);
  useLayoutEffect(() => {
    if (paramNumber) {
      dispatch(viewOrderThunk(paramNumber));
    }
  }, [paramNumber]);

  const orderData = useSelector(selectViewOrder);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length || orderNumber !== paramNumber)
      return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
