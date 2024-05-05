import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { ProtectedRoute } from '../protected-route';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { getCookie } from '../../utils/cookie';
import {
  authChecked,
  getUserThunk,
  selectUserAuthChecked,
  selectUserAuthenticated,
  selectUserData
} from '../../services/slices/userSlice';
import {
  getIngredientsThunk,
  selectIngredientsInit,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthChecked = useSelector(selectUserAuthChecked);
  const isIngredientsInit = useSelector(selectIngredientsInit);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  useLayoutEffect(() => {
    if (!isAuthChecked) {
      if (getCookie('accessToken')) {
        dispatch(getUserThunk());
      } else {
        dispatch(authChecked());
      } /*.then(
        dispatch()
      );*/
    }
    if (!isIngredientsInit && !isIngredientsLoading)
      dispatch(getIngredientsThunk());
  }, []);
  /*const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isLoading = useSelector(selectUserPending);*/
  const backgroundLocation = location.state?.background;
  const closeModal = useCallback(() => {
    navigate(backgroundLocation);
  }, [backgroundLocation]);
  console.log('location.state', location.state);
  const lastlink = location.pathname.split('/');

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnauth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnauth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnauth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnauth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${lastlink[lastlink.length - 1]}`}
                onClose={closeModal}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={`#${lastlink[lastlink.length - 1]}`}
                  onClose={closeModal}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
