export const anonimizeName = (firstName?: string, lastName?: string) => {
  return firstName && lastName ? `${firstName} ${lastName[0]}.` : '-';
};
