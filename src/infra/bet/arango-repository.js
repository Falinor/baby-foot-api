import { map as mapAsync } from 'async'
import { aql } from 'arangojs'
import { BetCommand } from '../../app'

const find = ({ db, matchRepository, bettorRepository }) => async ({
  where = {}
} = {}) => {
  const filterEvent = where?.event
    ? aql`FILTER bet.event == ${where.event}`
    : aql``
  const filterMatch = where?.match
    ? aql`FILTER bet.match == ${where.match}`
    : aql``
  const filterStatus = where?.status
    ? aql`FILTER bet.status == ${where.status}`
    : aql``
  const bets = await db
    .query(
      aql`
    FOR bet IN bets
      ${filterEvent}
      ${filterMatch}
      ${filterStatus}
      SORT bet.createdAt DESC, bet.expiresAt DESC
      RETURN bet
  `
    )
    .then((cursor) => cursor.all())
  return mapAsync(bets, async (bet) => {
    const takers = await mapAsync(bet.takers, async (taker) =>
      bettorRepository.get(taker)
    )
    const [bettor, match] = await Promise.all([
      bettorRepository.get(bet.bettor),
      matchRepository.get(bet.match)
    ])
    return fromDatabase({ ...bet, bettor, match, takers })
  })
}

const get = ({ db, bettorRepository, matchRepository }) => async (id) => {
  const betCollection = db.collection('bets')
  const bet = await betCollection.document({ _key: id }, { graceful: true })
  if (!bet) {
    return null
  }

  const takers = await mapAsync(bet.takers, async (taker) =>
    bettorRepository.get(taker)
  )
  const [bettor, match] = await Promise.all([
    bettorRepository.get(bet.bettor),
    matchRepository.get(bet.match)
  ])
  return fromDatabase({ ...bet, bettor, match, takers })
}

const create = ({ db }) => async (bet) => {
  const betCollection = db.collection('bets')
  await betCollection.save(toDatabase(bet))
  return bet
}

const update = ({ db }) => async (id, bet) => {
  const betCollection = db.collection('bets')
  await betCollection.update({ _key: id }, bet)
}

const updateAll = ({ db }) => async (betIds, bet) => {
  const betCollection = db.collection('bets')
  const bets = betIds.map((bet) => ({ _key: bet }))
  await betCollection.updateAll(bets, bet)
}

const removeAll = ({ db }) => async ({ match }) => {
  await db.query(aql`
    FOR bet IN bets
      FILTER bet.match == ${match}
      REMOVE bet IN bets
  `)
}

export const fromDatabase = (betEntity) => ({
  id: betEntity._key,
  bettor: betEntity.bettor,
  match: betEntity.match,
  takers: betEntity.takers,
  event: betEntity.event,
  team: betEntity.team,
  points: betEntity.points,
  sip: betEntity.sip,
  against: betEntity.against,
  status: betEntity.status,
  createdAt: betEntity.created,
  updatedAt: betEntity.updatedAt,
  expiresAt: betEntity.expiresAt
})

export const toDatabase = (bet) => ({
  _key: bet.id,
  bettor: bet.bettor.id,
  match: bet.match.id,
  takers: bet.takers.map((taker) => taker.id),
  event: bet.event,
  team: bet.team,
  points: bet.points,
  sip: bet.sip,
  against: bet.against,
  status: bet.status,
  createdAt: bet.created,
  updatedAt: bet.updatedAt,
  expiresAt: bet.expiresAt
})

export function createBetArangoRepository({
  db,
  matchRepository,
  bettorRepository
}) {
  return {
    find: find({ db, matchRepository, bettorRepository }),
    get: get({ db, matchRepository, bettorRepository }),
    create: create({ db }),
    update: update({ db }),
    updateAll: updateAll({ db }),
    removeAll: removeAll({ db })
  }
}
