import { createVertexCollection } from '../../services/arango/vertex';

export const TEAM_COLLECTION = 'teams';

export const teamCollection = async () => {
  const Team = await createVertexCollection(TEAM_COLLECTION);
  Team.getOrSave = getOrSave(Team);
  // Other custom methods
  // ...
  return Team;
}

/**
 * Retrieves a team if it exists, or creates it.
 */
const getOrSave = (Team) => (team) => {
  return Team.firstExample(team)
    .catch(() => Team.firstExample({ players: team.players.reverse() }))
    .catch(err => {
      // Create a new team if none exist
      if (err.code === 404) {
        return Team.save(team).then(t => t.vertex);
      } else {
        // TODO: log error
        console.log(err);
      }
    });
};
