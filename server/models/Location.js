import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: {
    en: { type: String, required: true },
    hi: { type: String },
    te: { type: String },
    ta: { type: String }
  },
  coordinates: {
    lat: Number,
    lon: Number
  }
}, { timestamps: true });

export default mongoose.model('Location', locationSchema);
