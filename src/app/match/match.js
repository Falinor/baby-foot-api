export const isOver = (max) => (match) =>
  match.teams.some((team) => team.points === max)
