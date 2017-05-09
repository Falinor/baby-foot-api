import mongoose, { Schema } from 'mongoose';

const matchSchema = new Schema({
  red: {
    trigrams: {
      type: String
    }
  },
  blue: {
    trigrams: {
      type: String
    }
  }
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
