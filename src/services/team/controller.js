import { notFound, success } from '../../components/response';
import graph from '../../components/arango';
import { TEAM_COLLECTION } from '../team/model';

export const index = async ({ query }, res, next) => {
  const Team = graph().vertexCollection(TEAM_COLLECTION);
  return Team.all(query)
    .then(data => data['_result'])
    .then(success(res))
    .catch(next);
};

export const show = async ({ params }, res, next) => {
  const Team = graph().vertexCollection(TEAM_COLLECTION);
  return Team.vertex(params.id)
    .then(notFound(res))
    .then(data => data['vertex'])
    .then(success(res))
    .catch(next);
};

export const wins = async ({ params }, res, next) => {
  const Played = graph().vertexCollection(PLAYED_COLLECTION);
  return Played.outEdges(`${TEAM_COLLECTION}/${params.id}`)
    .then(edges => {
      res.set('Result-Count', edges.length);
      return edges;
    })
    .then(success(res))
    .catch(next);
};

export const losses = async ({ params }, res, next) => {
  const Lost = graph().edgeCollection(LOST_COLLECTION);
  return Lost.outEdges(`${TEAM_COLLECTION}/${params.id}`)
    .then(edges => {
      res.set('Result-Count', edges.length);
      return edges;
    })
    .then(success(res))
    .catch(next);
};
