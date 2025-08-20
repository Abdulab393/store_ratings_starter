export const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export const validateUserSignup = (payload) => {
  const errors = [];
  if (!payload.name || payload.name.length < 20 || payload.name.length > 60) errors.push('Name must be 20–60 chars');
  if (!payload.address || payload.address.length > 400) errors.push('Address max 400 chars');
  if (!payload.email || !/^\S+@\S+\.\S+$/.test(payload.email)) errors.push('Invalid email');
  if (!payload.password || !passwordRegex.test(payload.password)) errors.push('Password must be 8–16 chars incl. 1 uppercase & 1 special');
  return errors;
};
