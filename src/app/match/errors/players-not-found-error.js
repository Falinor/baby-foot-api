import ExtendableError from 'es6-error'

export class PlayersNotFoundError extends ExtendableError {
  constructor(...ids) {
    super(
      ids?.length > 1
        ? `The players ${ids.join(', ')} were not found`
        : `The player ${ids} was not found`
    )
  }
}
