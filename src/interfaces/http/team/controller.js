import HttpStatus from 'http-status'

const index = (teamRepository) => async (ctx) => {
  ctx.body = await teamRepository.find({
    where: ctx.query
  })
  ctx.status = HttpStatus.OK
}

export const createTeamController = ({ teamRepository }) => ({
  index: index(teamRepository)
})
