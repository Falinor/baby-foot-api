import logger from '../../components/logger';
import { notFound, success } from '../../components/response';

export const find = (graph) => async (req, res, next) => {
  const players = graph.vertexCollection('players');
  return players.all(req.query)
    .then(data => data['_result'])
    .then(success(res))
    .catch(next);
};

export const get = (db, graph) => async ({ params }, res, next) => {
  const players = graph.vertexCollection('players');
  const trigram = params.trigram.toUpperCase();
  return players.firstExample({ trigram })
    .then(success(res))
    .catch(notFound(res));
};

export const teams = (db, graph) => async ({ params }, res, next) => {
  const players = graph.vertexCollection('players');
  const played = graph.edgeCollection('played');
  const trigram = params.trigram.toUpperCase();
  return players.firstExample({ trigram })
    .then(player => played.outEdges(player._key))
    .then(success(res))
    .catch(notFound(res));
};

export const winCount = (db, graph) => async ({ params }, res, next) => {
  const bindVars = {
    trigram: params.trigram.toUpperCase()
  };
  return db.query(`
    LET player = (FOR p in players FILTER p.trigram == @trigram RETURN FIRST(p))
    RETURN player
  `, bindVars)
    .then(data => {
      console.log(data);
      return data;
    })
    .then(cursor => cursor.all())
    .then(success(res))
    .catch(next);
};

export default (graph) => ({
  find: find(graph),
  get: get(graph),
  teams: teams(graph),
  winCount: winCount(graph)
});
