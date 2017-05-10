import mongoose, { Schema } from 'mongoose';

import {
  maxArrayLengthValidator,
  minArrayLengthValidator,
  trigramValidator
} from '../../services/validators';

const teamSchema = {
  trigrams: {
    type: [String],
    required: [true, 'Trigrams are required'],
    trim: true,
    uppercase: true,
    validate: [
      {
        validator: minArrayLengthValidator(1),
        message: 'A team cannot have more than 2 members'
      },
      {
        validator: maxArrayLengthValidator(2),
        message: 'A team cannot have more than 2 members'
      },
      {
        validator: async (v) => {
          const promises = v.map(trigramValidator());
          return Promise.all(promises)
            .then(validations => validations.every(val => val === true))
            .catch(console.error);
        },
        message: 'Bad trigram value'
      }
    ]
  },
  points: {
    type: Number,
    required: [true, 'Points are required'],
    min: [-10, 'A team cannot have less than -10 points'],
    max: [10, 'A team cannot have more than 10 points']
  }
};

const matchSchema = new Schema({
  red: teamSchema,
  blue: teamSchema
}, {
  timestamps: true
});

matchSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      red: this.red,
      blue: this.blue,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    return full ? {
      ...view
      // add properties for a full view
    } : view;
  }
};

const model = mongoose.model('Match', matchSchema);

export const schema = model.schema;
export default model;
