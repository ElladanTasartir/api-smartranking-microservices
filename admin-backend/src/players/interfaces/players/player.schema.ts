import { Schema } from 'mongoose';

export const PlayerSchema = new Schema(
  {
    phoneNumber: { type: String },
    email: { type: String, unique: true },
    name: String,
    ranking: String,
    position: Number,
    avatarUrl: String,
  },
  {
    timestamps: true,
    collection: 'players',
  },
);
