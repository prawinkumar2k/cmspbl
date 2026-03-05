import { useState, useCallback } from 'react';

/**
 * Custom hook for form validation with visual feedback
 * Usage in any form component:
 * 
 * const { 
 *   touchedFields, 
 *   fieldErrors, 
 *   validateField, 
 *   getFieldClasses,
 *   getSelectClasses,
 *   setFieldTouched,
 *   validateAllFields,
 *   resetValidation
 * } = useFormValidation(REQUIRED_FIELDS);
 */

export const useFormValidation = (requiredFields = {}) => {
  const [touchedFields, setTouchedFields] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  // Validate a single field
  const validateField = useCallback((fieldName, value) => {
    // If field is not in required fields list, skip validation
    if (!requiredFields[fieldName]) return null;

    const fieldLabel = requiredFields[fieldName];

    // Check if field is empty
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldLabel} is required`;
    }

    // Format validations can be added here
    if (fieldName === 'stdMobile' && value && value.length < 10) {
      return 'Mobile must have 10 digits';
    }
    if (fieldName === 'aadharNo' && value && value.length > 0 && value.length < 12) {
      return 'Aadhar must have 12 digits';
    }
    if (fieldName === 'panNo' && value && value.length > 0 && value.length < 10) {
      return 'PAN must have 10 digits';
    }
    if (fieldName === 'fatherContact' && value && value.length > 0 && value.length < 10) {
      return 'Father Mobile must have 10 digits';
    }
    if (fieldName === 'motherContact' && value && value.length > 0 && value.length < 10) {
      return 'Mother Mobile must have 10 digits';
    }
    if (fieldName === 'guardianMobile' && value && value.length > 0 && value.length < 10) {
      return 'Guardian Mobile must have 10 digits';
    }

    return null;
  }, [requiredFields]);

  // Get CSS classes for input fields
  const getFieldClasses = useCallback((fieldName, baseClass = 'form-control', editMode = false) => {
    if (!touchedFields[fieldName] && !editMode) {
      return baseClass;
    }

    const isRequired = requiredFields[fieldName];
    const hasError = fieldErrors[fieldName];

    if (hasError) {
      return `${baseClass} is-invalid border-danger`;
    }

    if (isRequired) {
      return `${baseClass} is-valid border-success`;
    }

    return baseClass;
  }, [touchedFields, fieldErrors, requiredFields]);

  // Get CSS classes for select fields
  const getSelectClasses = useCallback((fieldName, baseClass = 'form-select', editMode = false) => {
    if (!touchedFields[fieldName] && !editMode) {
      return baseClass;
    }

    const isRequired = requiredFields[fieldName];
    const hasError = fieldErrors[fieldName];

    if (hasError) {
      return `${baseClass} is-invalid border-danger`;
    }

    if (isRequired) {
      return `${baseClass} is-valid border-success`;
    }

    return baseClass;
  }, [touchedFields, fieldErrors, requiredFields]);

  // Mark field as touched
  const setFieldTouched = useCallback((fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  // Validate all required fields at once
  const validateAllFields = useCallback((formData) => {
    const errors = {};
    const missingFields = [];

    Object.keys(requiredFields).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        errors[fieldName] = error;
        missingFields.push(requiredFields[fieldName]);
      }
    });

    setFieldErrors(errors);

    // Mark all fields as touched
    const allTouched = Object.keys(requiredFields).reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {});
    setTouchedFields(allTouched);

    return { errors, missingFields, isValid: missingFields.length === 0 };
  }, [requiredFields, validateField]);

  // Reset all validation states
  const resetValidation = useCallback(() => {
    setTouchedFields({});
    setFieldErrors({});
  }, []);

  // Handle field change with validation
  const handleFieldChange = useCallback((fieldName, value) => {
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));

    // Validate field
    const error = validateField(fieldName, value);
    if (error) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
    } else {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  }, [validateField]);

  return {
    touchedFields,
    fieldErrors,
    validateField,
    getFieldClasses,
    getSelectClasses,
    setFieldTouched,
    validateAllFields,
    resetValidation,
    handleFieldChange,
    setFieldErrors,
    setTouchedFields
  };
};

export default useFormValidation;
