import { hasDuplicate } from '../array'

describe('Unit | Array', () => {
  describe('#hasDuplicate', () => {
    it('should return true if the array contains at least one duplicate', () => {
      const actual = hasDuplicate([1, 2, 1, 3])
      expect(actual).toBe(true)
    })

    it('should return false if the array contains no duplicate', () => {
      const actual = hasDuplicate([1, 2, 3])
      expect(actual).toBe(false)
    })
  })
})
