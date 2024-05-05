import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  authChecked,
  getUserThunk,
  selectUserAuthChecked,
  selectUserAuthError,
  selectUserAuthenticated,
  selectUserLoading
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';
import { getCookie } from '../../utils/cookie';
import { useLayoutEffect, useState } from 'react';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnauth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnauth
}: ProtectedRouteProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(selectUserAuthenticated);
  const isLoading = useSelector(selectUserLoading);
  const isAuthChecked = useSelector(selectUserAuthChecked);
  const authError = useSelector(selectUserAuthError);

  //console.log(    'isAuthenticated2',    isAuthenticated,    'isLoading2',    isLoading,    'isAuthChecked',    isAuthChecked  );
  //const isAuthChecked = useSelector(isAuthCheckedSelector); // isAuthCheckedSelector — селектор получения состояния загрузки пользователя
  //const user = useSelector(userDataSelector); // userDataSelector — селектор получения пользователя из store

  if (isLoading || !isAuthChecked) {
    // пока идёт чекаут пользователя, показываем прелоадер
    return <Preloader />;
  }

  if (authError) {
    return (
      <>
        <p>
          {authError.name} {authError.code}
        </p>
        <p>{authError.message}</p>
      </>
    );
  }

  if (!onlyUnauth && !isAuthenticated) {
    // если пользователь на странице авторизации и данных в хранилище нет, то делаем редирект
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnauth && isAuthenticated) {
    // если пользователь на странице авторизации и данные есть в хранилище
    return <Navigate replace to={location.state?.from || '/'} />;
  }

  return children;
};
