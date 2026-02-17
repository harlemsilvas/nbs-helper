export * from './types.js';

export function normalizeText(text) {
  return (text || '')
    .toString()
    .trim()
    .replace(/\s+/g, ' ');
}

export function removeDiacritics(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
