import { success } from '../../services/response';
import Match from './model';
import Player from '../player/model';
import Team from '../team/model';
import { Won, Lost, In } from '../edges/index';
import graph, { db } from '../../services/arango';

// export const create = async ({ bodymen: { body } }, res, next) => {
export const create = async ({ body }, res, next) => {
  try {
    // Save the match
    console.log(Match.saveOrCreate());
    const match = await Match.save({ playedOn: new Date() });
    // Save the teams
    console.log(body);
    const teams = await Promise.all([
      Team.save({ players: body.won.players }),
      Team.save({ players: body.lost.players })
    ]);
    // Save the winners
    const winners = await Promise.all(
      body.won.players.map(trigram => Player.save({ trigram }))
    );
    // Save the losers
    const losers = await Promise.all(
      body.lost.players.map(trigram => Player.save({ trigram }))
    );
    // Create relationship between the winning team and the match
    const { color, points } = body.won;
    await Promise.all([
      Won.save({ color, points }, teams[0].vertex['_id'], match.vertex['_id']),
      Lost.save({ color, points }, teams[1].vertex['_id'], match.vertex['_id'])
    ]);
    //
    const winnerRels = winners.map(winner => In.save({
      _from: winner.vertex['_id'],
      _to: teams[0].vertex['_id']
    }));
    const loserRels = losers.map(loser => In.save({
      _from: loser.vertex['_id'],
      _to: teams[1].vertex['_id']
    }))
    await Promise.all([
      ...winnerRels,
      ...loserRels
    ]);
    res.status(201).json(match.vertex);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Match.all()
    .then(data => res.status(200).json(data))
    .catch(next);

/*
export const show = ({ params }, res, next) =>
  Match.findById(params.id)
    .then(notFound(res))
    .then((match) => match ? match.view() : null)
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Match.findById(params.id)
    .then(notFound(res))
    .then((match) => match ? match.remove() : null)
    .then(success(res, 204))
    .catch(next);
    */
