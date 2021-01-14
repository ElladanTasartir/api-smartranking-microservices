import { Schema } from 'mongoose';

export const ChallengeSchema = new Schema(
  {
    date: { type: Date },
    status: { type: String },
    requested_at: { type: Date },
    answered_at: { type: Date },
    challenger: { type: Schema.Types.ObjectId },
    category: { type: String },
    players: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    match: {
      type: Schema.Types.ObjectId,
      ref: 'Match',
    },
  },
  { timestamps: true, collection: 'challenges' },
);
