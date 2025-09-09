const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  { 
    groupTilte: {
      type: String,
    },
    members: {
      type: Array,
    },
    lastMessage: {   // ✅ fix name
      type: String,
      default: "",
    },
    lastMessageId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
