import graph, { createVertexCollection } from '../../components/arango';

export const TEAM_COLLECTION = 'teams';

export const createTeamCollection = async () => {
  return createVertexCollection(TEAM_COLLECTION);
};

export const getOrSaveTeam = async (body) => {
  // FIXME
  const Team = graph().vertexCollection(TEAM_COLLECTION);
  try {
    return Team.save(body);
  } catch (e) {
    // FIXME: return the existing team
  }
};
