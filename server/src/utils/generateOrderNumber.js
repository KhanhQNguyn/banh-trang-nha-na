import mongoose from 'mongoose';

// We define a simple Counter schema to keep daily order sequences
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. 'order_YYYYMMDD'
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

export const generateOrderNumber = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  const counterId = `order_${dateStr}`;

  // Increment seq atomically. Upsert if it doesn't exist
  const counter = await Counter.findOneAndUpdate(
    { _id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedSeq = String(counter.seq).padStart(3, '0');
  return `BTNN-${dateStr}-${paddedSeq}`;
};
