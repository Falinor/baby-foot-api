export const matchSchema = {
  title: 'Match',
  type: 'object',
  properties: {
    playedOn: {
      type: 'object',
      format: 'date',
      default: new Date()
    },
    red: {
      type: 'object',
      properties: {
        points: { type: 'integer', minimum: -10, maximum: 10 }
      },
      required: ['points']
    },
    blue: {
      type: 'object',
      properties: {
        points: { type: 'integer', minimum: -10, maximum: 10 }
      },
      required: ['points']
    }
  },
  required: ['red', 'blue']
};
