const Messages = require("../model/messages");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const express = require("express");
const path = require("path")
const { upload } = require("../multer");
const router = express.Router();

//create new message
router.post(
  "/create-new-message",
  upload.single("images"),
  catchAsyncError(async (req, res, next) => {
    try {
      const messageData = req.body;

    if (req.file) {
  const filename = req.file.filename;
  const fileUrl = `/uploads/${filename}`; 
  messageData.images = fileUrl;
}


      const message = new Messages({
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images || undefined,
      });

      await message.save();
      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400)); // ✅ safer error handling
    }
  })
);



// get all messages with conversation id
router.get("/get-all-messages/:id",catchAsyncError(async(req,res,next) => {
  try {
    const messages = await Messages.find({
      conversationId:req.params.id
    });
   res.status(200).json({
  success: true,
  messages 
})

    
  } catch (error) {
      return next(new ErrorHandler(error.response.message, 400));
  }
}))

module.exports = router;
