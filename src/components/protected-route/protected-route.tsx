import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectUserAuthChecked,
  selectUserAuthError,
  selectUserData
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnauth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnauth
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectUserAuthChecked);
  const user = useSelector(selectUserData);
  const authError = useSelector(selectUserAuthError);

  if (!isAuthChecked) {
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

  if (!onlyUnauth && !user) {
    // если пользователь на странице авторизации и данных в хранилище нет, то делаем редирект
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnauth && user) {
    // если пользователь на странице авторизации и данные есть в хранилище
    return <Navigate replace to={location.state?.from || '/'} />;
  }

  return children;
};
