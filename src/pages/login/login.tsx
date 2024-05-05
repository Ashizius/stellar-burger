import { FC, useLayoutEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import {
  getUserThunk,
  loginUserThunk,
  selectUserSending
} from '../../services/slices/userSlice';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useDispatch, useSelector } from '../../services/store';
import { getCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { handleSubmit, error } = useAuthUser({ email, password }, () => {
    dispatch(loginUserThunk({ email, password }));
  });

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
