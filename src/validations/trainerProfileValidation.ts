import { type UpdateTrainerProfileDTO } from "../types/trainerType";
import {type ValidationErrors } from "./ValidationErrors";
export const trainerProfileValidation = (data: UpdateTrainerProfileDTO): ValidationErrors<UpdateTrainerProfileDTO> => {
  const newErrors: ValidationErrors<UpdateTrainerProfileDTO> = {};

  if (!data.name?.trim()) {
    newErrors.name = "Full name is required";
  } else if (data.name.length < 3) {
    newErrors.name = "Name must be at least 3 characters long";
  }

  if (!data.gender) {
    newErrors.gender = "Gender is required";
  }

  if (data.experience === undefined || data.experience === null) {
    newErrors.experience = "Experience is required";
  }

  if (!data.programs || data.programs.length === 0) {
    newErrors.programs = "Please select at least one program";
  }

  if (!data.languages || data.languages.length === 0) {
    newErrors.languages = "Please select at least one language";
  }

  if (!data.pricePerSession || data.pricePerSession <= 0) {
    newErrors.pricePerSession = "Price per session must be greater than 0";
  }

  if (data.bio && data.bio.trim().length < 10) {
    newErrors.bio = "Bio should be at least 10 characters long";
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!data.phone?.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!phoneRegex.test(data.phone.trim())) {
    newErrors.phone = "Enter a valid 10-digit phone number";
  }

  if (!data.address?.trim()) {
    newErrors.address = "Address is required";
  }

  return newErrors;
};