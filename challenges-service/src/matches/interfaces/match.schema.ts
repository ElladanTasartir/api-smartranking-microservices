import { Schema } from 'mongoose';

export const MatchSchema = new Schema(
  {
    category: { type: String },
    def: { type: Schema.Types.ObjectId, ref: 'Player' },
    players: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    result: [{ set: { type: String } }],
  },
  { timestamps: true, collection: 'matches' },
);
