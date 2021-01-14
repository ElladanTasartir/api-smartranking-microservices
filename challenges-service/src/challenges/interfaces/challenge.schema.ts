import { Schema } from 'mongoose';

export const ChallengeSchema = new Schema(
  {
    date: { type: Date },
    status: { type: String },
    requested_at: { type: Date },
    answered_at: { type: Date },
    challenger: { type: Schema.Types.ObjectId, ref: 'Player' },
    category: { type: String },
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    match: {
      type: Schema.Types.ObjectId,
      ref: 'Match',
    },
  },
  { timestamps: true, collection: 'challenges' },
);
