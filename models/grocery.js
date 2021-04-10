const mongoose = require('mongoose');

const grocerySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  item: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date,  default: Date.now }
});

const grocery = mongoose.model('grocery', grocerySchema);
module.exports = grocery;
