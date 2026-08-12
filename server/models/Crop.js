import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: {
    en: { type: String, required: true },
    hi: { type: String },
    te: { type: String },
    ta: { type: String }
  },
  idealConditions: {
    temperature: { min: Number, max: Number },
    humidity: { min: Number, max: Number },
    rainfall: { min: Number, max: Number } // mm per month
  }
}, { timestamps: true });

export default mongoose.model('Crop', cropSchema);
