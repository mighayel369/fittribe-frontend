import { type changePassword } from "../types/changePasswordType";
import {type ValidationErrors } from "./ValidationErrors";
export const validatePasswordChange = (data:changePassword): ValidationErrors<changePassword> => {
   const errors: ValidationErrors<changePassword> = {};
  console.log(data)
  if (!data.currentPassword.trim()) {
    errors.currentPassword = "Current password is required";
  }

  if (!data.newPassword.trim()) {
    errors.newPassword = "Password is required";
  } else if (data.newPassword.length < 6) {
    errors.newPassword = "Password must be at least 6 characters";
  } else if (!/[A-Z]/.test(data.newPassword)) {
    errors.newPassword = "Password must include at least one uppercase letter";
  } else if (!/[a-z]/.test(data.newPassword)) {
    errors.newPassword = "Password must include at least one lowercase letter";
  } else if (!/[0-9]/.test(data.newPassword)) {
    errors.newPassword = "Password must include at least one number";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.newPassword)) {
    errors.newPassword = "Password must include at least one special character";
  }

  if (!data.confirmPassword.trim()) {
    errors.confirmPassword = "Please confirm your new password";
  } else if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};