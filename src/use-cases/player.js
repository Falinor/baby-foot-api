/**
 * @module Player use-case interactor
 */

/**
 *
 * @param id
 * @param findPlayerById
 * @return {*}
 */
export const findPlayer = ({ id, findPlayerById }) => findPlayerById(id);

export default {
  findPlayer,
};
