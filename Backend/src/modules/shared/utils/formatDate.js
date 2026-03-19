/**
 * Formats a date to YYYY-MM-DD format
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
const toDateString = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toISOString().split('T')[0];
};

/**
 * Formats a date to a localized, readable string (e.g. "Jan 1, 2026")
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
const toReadableDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Formats a date to include time (e.g. "Jan 1, 2026, 12:00 PM")
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date/time string
 */
const toDateTimeString = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

/**
 * Returns true if the date is in the past
 * @param {Date|string} date - The date to check
 * @returns {boolean}
 */
const isPastDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  return d < new Date();
};

module.exports = {
  toDateString,
  toReadableDate,
  toDateTimeString,
  isPastDate
};
