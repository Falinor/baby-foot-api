export const playerSchema = {
  title: 'Player',
  type: 'object',
  properties: {
    trigram: {
      type: 'string',
      pattern: '^[A-Z]{3}$'
    }
  },
  required: ['trigram']
};
