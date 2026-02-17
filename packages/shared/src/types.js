/**
 * @typedef {Object} NBSItem
 * @property {string} code - Código NBS
 * @property {string} description - Descrição oficial
 * @property {string} [level] - Nível (capítulo, grupo, subitem)
 * @property {string[]} [keywords] - Palavras-chave para busca
 */

/**
 * @typedef {Object} SearchIndex
 * @property {string} version - Versão do dataset
 * @property {string} generatedAt - Data de geração
 * @property {number} totalItems - Total de itens
 * @property {NBSItem[]} items - Lista de itens
 */

export const NBSLevels = {
  CAPITULO: 'capítulo',
  GRUPO: 'grupo',
  SUBGRUPO: 'subgrupo',
  SUBITEM: 'subitem',
};
