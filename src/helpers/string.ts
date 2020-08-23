import accents from 'remove-accents';

export const cleanString = (str: string) => {
  return accents.remove(str).toLowerCase().replace(/\s\s+/g, ' ').trim();
};

export const normaliseString = (str: string) => {
  return accents.remove(str).toLowerCase()
    .replace(/\s\s+/g, ' ').replace(/-|:|,|\\|\//g, '').trim();
};
