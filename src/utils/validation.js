/**
 * Form validation utility functions
 */

/**
 * Validate an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate a password
 * @param {string} password - Password to validate
 * @returns {boolean} True if password is valid
 */
export const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

/**
 * Validate ETH wallet address
 * @param {string} address - Wallet address to validate
 * @returns {boolean} True if address is valid
 */
export const validateWalletAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Get form error message for various form fields
 * @param {string} field - Field name
 * @param {any} value - Field value
 * @returns {string|null} Error message or null if valid
 */
export const getFieldErrorMessage = (field, value) => {
  switch (field) {
    case 'email':
      if (!value) return 'Email is required';
      if (!validateEmail(value)) return 'Please enter a valid email address';
      return null;
      
    case 'password':
      if (!value) return 'Password is required';
      if (!validatePassword(value)) return 'Password must be at least 8 characters with uppercase, lowercase, and number';
      return null;
      
    case 'walletAddress':
      if (!value) return 'Wallet address is required';
      if (!validateWalletAddress(value)) return 'Please enter a valid Ethereum wallet address';
      return null;
      
    case 'name':
    case 'firstName':
    case 'lastName':
      if (!value) return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      if (value.length < 2) return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least 2 characters`;
      return null;
      
    default:
      return null;
  }
}; 