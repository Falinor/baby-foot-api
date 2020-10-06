import { matchFactory } from '../../../utils'
import { FindMatchesUseCase } from '../find-matches'

describe('Unit | Use case | FindMatches', () => {
  let useCase
  let matches
  let matchRepository

  beforeEach(() => {
    matches = matchFactory.buildList(3)
    matchRepository = {
      find: jest.fn().mockResolvedValue(matches)
    }
    useCase = new FindMatchesUseCase({ matchRepository })
  })

  describe('#execute', () => {
    let onSuccess

    beforeEach(async () => {
      onSuccess = jest.fn().mockResolvedValue(matches)
      await useCase.execute({ onSuccess })
    })

    it('returns a list of matches', () => {
      expect(matchRepository.find).toHaveBeenCalled()
    })

    it('calls "onSuccess"', () => {
      expect(onSuccess).toHaveBeenCalledWith(matches)
    })
  })
})
