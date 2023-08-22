export function shortAddress(address: string, prefixLength = 6, suffixLength = 4) {
  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);

  return `${prefix}...${suffix}`;
}

export function formatDate(date: Date) {
    if (!(date instanceof Date)) {
      throw new Error("Input must be a Date object");
    }
  
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().substr(-2); // Extract the last two digits of the year
  
    return `${dayOfWeek} ${month} ${year}`;
  }