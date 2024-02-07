import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ConversationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Conversation name is required."],
      trim: true
    },
    picture: {
      type: String,
      required: true
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: false
    },
    users: [
      {
        type: ObjectId,
        ref: "User"
      }
    ],
    latestMessage: {
      type: ObjectId,
      ref: "Message"
    },
    admin: {
      type: ObjectId,
      ref: "User"
    }
  },
  {
    collection: "conversations",
    timestamps: true
  }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
