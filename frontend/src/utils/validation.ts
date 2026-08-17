export type FieldErrors = Record<string, string>;

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateLogin(username: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!username.trim()) {
    errors.username = 'Username is required';
  } else if (username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  return errors;
}

export function validateRegister(form: {
  fullName: string;
  username: string;
  email: string;
  department: string;
  password: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }
  if (!form.username.trim()) {
    errors.username = 'Username is required';
  } else if (form.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address';
  }
  if (!form.department.trim()) {
    errors.department = 'Department is required';
  }
  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  return errors;
}

export function validateAssetForm(form: {
  name: string;
  category: string;
  purchaseCost?: number | '';
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) {
    errors.name = 'Asset name is required';
  }
  if (!form.category) {
    errors.category = 'Category is required';
  }
  if (form.purchaseCost !== undefined && form.purchaseCost !== '' && Number(form.purchaseCost) < 0) {
    errors.purchaseCost = 'Purchase cost cannot be negative';
  }
  return errors;
}
