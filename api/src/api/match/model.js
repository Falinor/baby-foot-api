import mongoose, { Schema } from 'mongoose';

import {
  minArrayLengthValidator,
  maxArrayLengthValidator
} from '../../services/validators';

const teamSchema = {
  trigrams: {
    type: [String],
    required: true,
    validate: [
      {
        validator: minArrayLengthValidator(1),
        message: 'Array should contain atleast 1 element'
      },
      {
        validator: maxArrayLengthValidator(2),
        message: 'Array should contain not more than 2 elements'
      }
    ]
  }
};

const matchSchema = new Schema({
  red: teamSchema,
  blue: teamSchema
}, {
  timestamps: true
});

matchSchema.methods = {
  view (full) {
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
