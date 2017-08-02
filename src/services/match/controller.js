import { create, find, get } from '../../components/controller';
import { success } from '../../components/response';

/**
 *
 * @param model
 */
export const getTeams = (model) => async (req, res, next) =>
  model.vertex(req.params.id)
    .then(match => model.getTeams(match._id))
    .then(success(res))
    .catch(next);

export const createTeams = (model) => async (req, res, next) =>
  model.vertex(req.params.id)
  // TODO: verify that this match has no teams already
    .then(async match => {
      const teams = await Promise.all([
        model.createTeam(match.red),
        model.createTeam(match.blue)
      ]);
      const [red, blue] = teams;
      await Promise.all([
        model.linkTeamsToMatch({ color: 'red' }, red._id, match._id),
        model.linkTeamsToMatch({ color: 'blue' }, blue._id, match._id)
      ])
      return teams;
    })
    .then(success(res, 201))
    .catch(next);

/**
 *
 * @param model
 */
export const winners = (model) => async ({ params }, res, next) => {
  res.status(501).json('Not implemented');
};

/**
 *
 * @param model
 */
export const losers = (model) => async ({ params }, res, next) => {
  res.status(501).json('Not implemented');
};

export { create, find, findOne, get } from '../../components/controller';

export default (model) => ({
  create: create(model),
  find: find(model),
  get: get(model),
  getTeams: getTeams(model),
  createTeams: createTeams(model),
  winners: winners(model),
  losers: losers(model)
});
