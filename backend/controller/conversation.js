const { isSeller, isAuthenticated } = require("../middleware/auth");
const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const express = require("express");
const router = express.Router();

//create a new conversation
router.post(
  "/create-new-conversation",
  catchAsyncError(async (req, res, next) => {
    try {
      const { groupTilte, userId, sellerId } = req.body;
      const isConversationExist = await Conversation.findOne({ groupTilte });

      if (isConversationExist) {
        const conversation = isConversationExist;
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        const conversation = await Conversation.create({
          members: [userId, sellerId],
          groupTilte: groupTilte,
        });

        res.status(201).json({
          success: true,
          conversation,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.response.message, 400));
    }
  })
);

// get seller conversation
router.get(
  "/get-all-conversation-seller/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const conversations = await Conversation.find(
        {
          members: {
            $in: [req.params.id],
          },
        }).sort({ updatedAt: -1, createdAt: -1 })
      

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

  // get user conversation
router.get(
  "/get-all-conversation-user/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const conversations = await Conversation.find(
        {
          members: {
            $in: [req.params.id],
          },
        }).sort({ updatedAt: -1, createdAt: -1 })
      

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// update the last message

router.put("/update-last-message/:id", catchAsyncError(async (req,res,next) => {
  try {
    const { lastMessage, lastMessageId } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { lastMessageId, lastMessage },
      { new: true }
    );

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
}));



module.exports = router;
