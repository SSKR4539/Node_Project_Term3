const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  quantityorderd: { type: Number, required: true },
  date: { type: Date,  default: Date.now }
});

const order = mongoose.model('order', grocerySchema);
module.exports = order;
