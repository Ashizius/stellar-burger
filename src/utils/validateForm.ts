const PWD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const formValidators = {
  email: {
    validator: (value: string) => EMAIL_REGEX.test(value),
    message: 'Укажите корректный email.'
  },
  password: {
    validator: (value: string) => PWD_REGEX.test(value),
    message: 'Укажите пароль посложнее.'
  }
};

export function validateForm<T extends object>(
  form: T
): { error: string; isEmpty: boolean } {
  const keys = Object.keys(form) as (keyof T)[];
  const validationResult = { error: '', isEmpty: true };
  validationResult.isEmpty = keys.every((key) => {
    if (typeof form[key] !== 'string') {
      return true;
    } else {
      return form[key] === '';
    }
  });
  validationResult.error = validationResult.isEmpty
    ? ''
    : keys.reduce((msg, key) => {
        if (typeof form[key] !== 'string') {
          return msg;
        }
        switch (key) {
          case 'email':
          case 'e-mail':
            return formValidators.email.validator(form[key] as string)
              ? msg
              : `${msg} ${formValidators.email.message}`;
          case 'password':
          case 'pass':
            return formValidators.password.validator(form[key] as string)
              ? msg
              : `${msg} ${formValidators.password.message}`;
          case 'name':
          case 'login':
            return (form[key] as string).length > 2
              ? msg
              : `${msg} Введите имя подлиннее.`;
          default:
            return msg;
        }
      }, '');
  return validationResult;
}
