/**
 * Data formatting utility functions
 */

/**
 * Format a date string to a readable format
 * @param {string|Date} dateStr - Date string or Date object
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateStr, options = {}) => {
  try {
    const date = new Date(dateStr);
    const defaultOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
};

/**
 * Format a number as currency
 * @param {number} value - Number to format
 * @param {string} currency - Currency code (USD, EUR, etc.)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${value}`;
  }
};

/**
 * Format a number with commas
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimals = 0) => {
  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    }).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toString();
  }
};

/**
 * Truncate a string if it's longer than the specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} ending - String to append to truncated string
 * @returns {string} Truncated string
 */
export const truncateString = (str, length = 30, ending = '...') => {
  if (!str) return '';
  
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }
  
  return str;
};

/**
 * Format a wallet address for display (0x1234...5678)
 * @param {string} address - Wallet address
 * @param {number} prefixLength - Number of characters to show at the beginning
 * @param {number} suffixLength - Number of characters to show at the end
 * @returns {string} Formatted address
 */
export const formatWalletAddress = (address, prefixLength = 6, suffixLength = 4) => {
  if (!address) return '';
  
  if (address.length <= prefixLength + suffixLength) {
    return address;
  }
  
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}; 