export const formatDisplayName = (email: string) => {
  const name = email.split("@")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
};