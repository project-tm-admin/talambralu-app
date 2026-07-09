// Lightweight module-level store for profile onboarding state.
// Avoids threading params through every intermediate screen.
let gender = 'Woman';

export const setGender = (g) => { gender = g; };
export const getGender = () => gender;
