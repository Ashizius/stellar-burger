import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrdersThunk,
  selectOrdersList
} from '../../services/slices/ordersListSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrdersThunk());
  }, []);
  const orders: TOrder[] = useSelector(selectOrdersList);

  return <ProfileOrdersUI orders={orders} />;
};
