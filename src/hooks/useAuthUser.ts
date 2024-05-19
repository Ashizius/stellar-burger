import { useDispatch, useSelector } from '../services/store';
import {
  selectFormError,
  selectUserSending
} from '../services/slices/userSlice';
import { validateForm } from '../utils/validateForm';
import { SyntheticEvent } from 'react';

export function useAuthUser<T extends object>(
  formData: T,
  callback: () => void
) {
  const submitError = useSelector(selectFormError)?.message || '';
  const inputError = validateForm<T>(formData);
  const isLoading = useSelector(selectUserSending);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (inputError.isEmpty) {
      inputError.error = 'заполните все поля';
    } else {
      isLoading || callback();
    }
  };
  return {
    handleSubmit,
    error: isLoading ? '⏳' : submitError || inputError.error
  };
}
