/**
 * Safely converts a date string or Date object to a Date object
 */
export function toDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }
  
  if (typeof date === 'string') {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  return null;
}

/**
 * Formats a date for display in the UI
 */
export function formatDisplayDate(date: string | Date | null | undefined): string {
  const dateObj = toDate(date);
  if (!dateObj) return 'Invalid date';
  
  try {
    return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}

/**
 * Formats a date for relative display (e.g., "2 hours ago")
 */
export function formatRelativeDate(date: string | Date | null | undefined): string {
  const dateObj = toDate(date);
  if (!dateObj) return 'Unknown';
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMs < 60000) { // Less than 1 minute
    return 'Just now';
  } else if (diffMs < 3600000) { // Less than 1 hour
    const minutes = Math.floor(diffMs / (1000 * 60));
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) { // Less than 1 day
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) { // Less than 1 week
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else {
    // More than a week, show the actual date
    return formatDisplayDate(date);
  }
}

/**
 * Checks if two dates are the same
 */
export function isSameDate(date1: string | Date | null | undefined, date2: string | Date | null | undefined): boolean {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  
  if (!d1 || !d2) return false;
  
  return d1.getTime() === d2.getTime();
}
