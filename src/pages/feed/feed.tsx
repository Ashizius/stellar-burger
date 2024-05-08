import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedsInit,
  selectFeedsLoading,
  selectFeedsOrders
} from '../../services/slices/feedsSlice';
import { getFeedsThunk } from '../../services/actions';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedsOrders);
  const isLoading = useSelector(selectFeedsLoading);
  const isInit = useSelector(selectFeedsInit);
  const updateFeeds = useCallback(() => {
    if (!isLoading && isInit) {
      dispatch(getFeedsThunk());
    }
  }, [isLoading, isInit]);
  useEffect(() => {
    if (!isInit) {
      dispatch(getFeedsThunk());
    }
  }, []);
  if (isLoading || !isInit) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={updateFeeds} />;
};
