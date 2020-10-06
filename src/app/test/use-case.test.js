import { UseCase } from '../use-case'

describe('Unit | Use case', () => {
  describe('#execute', () => {
    it('has a function "execute"', () => {
      const useCase = new UseCase()
      expect(typeof useCase.execute).toBe('function')
    })
  })
})
