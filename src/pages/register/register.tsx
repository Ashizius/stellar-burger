import { FC, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUserThunk } from '../../services/actions';
import { useDispatch } from '../../services/store';
import { useAuthUser } from '../../hooks/useAuthUser';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleSubmit, error } = useAuthUser(
    { user: userName, email, password },
    () => {
      dispatch(registerUserThunk({ name: userName, email, password }));
    }
  );
  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
