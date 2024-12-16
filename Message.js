const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: String, // User's name
    message: String, // Message content
    timestamp: { type: Date, default: Date.now }, 
});

// Create a model for messages
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
