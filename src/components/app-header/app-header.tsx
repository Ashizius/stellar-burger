import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUserData } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUserData)?.name;
  return <AppHeaderUI userName={userName || ''} />;
};
