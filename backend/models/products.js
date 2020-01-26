const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {type: String},
    description: {type: String},
    image: {type: String},
    image_original_name : {type: String},
    category_id: {type: String},

    quantity: {type: Number},  //miqdori
    
    brand: {type: String},
    model: {type: String},
    configuration: {type: String},

    price: {type: Number},
    sale: {type: Number},
    date: {type: String}
});




module.exports = mongoose.model('products', productSchema);