export const generateRandomString = (
  length = 25,
  characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
): string => {
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
};

export function extendDate(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}
