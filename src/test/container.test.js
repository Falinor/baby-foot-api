import { createContainer } from '../container'

const container = createContainer()

function tests(context, dependencies) {
  return describe(context, () => {
    dependencies.map((dependency) => {
      it(`should resolve ${dependency}`, () => {
        const actual = container.resolve(dependency)
        expect(actual).toBeDefined()
      })
    })
  })
}

describe('Unit | Container', () => {
  tests('Match', ['matchRouter'])

  tests('Ranking', ['rankingService'])
})
