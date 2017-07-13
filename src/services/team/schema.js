export const teamSchema = {
  title: 'Team',
  type: 'object',
  properties: {
    players: {
      type: 'array',
      minItems: 1,
      maxItems: 2,
      uniqueItems: true,
      items: { type: 'string', pattern: '^[A-Z]{3}$' }
    }
  },
  required: ['players']
};
