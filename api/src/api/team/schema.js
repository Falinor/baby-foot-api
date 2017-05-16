export const teamSchema = {
  color: {
    type: String,
    required: true,
    enum: ['red', 'blue']
  },
  points: {
    type: Number,
    required: true,
    min: -10,
    max: 10
  }
};
