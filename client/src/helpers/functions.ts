export const checkIsraelId = (id: string): boolean => {
  // Remove any non-digit characters from the ID
  const cleanedId = id.replace(/\D/g, "");

  // Check if the cleaned ID has exactly 9 digits
  if (cleanedId.length !== 9) {
    return false;
  }

  // Convert the cleaned ID to an array of digits
  const digits = cleanedId.split("").map(Number);

  // Calculate the checksum using the Luhn algorithm
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];
    if (i % 2 === digits.length % 2) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }

  // The ID is valid if the checksum is a multiple of 10
  return sum % 10 === 0;
};
