var mongoose = require('mongoose');

var BrandSchema = new mongoose.Schema({
    name: {type: String, required: true },
    picture: {type: String, required: true },
    allow: {type: Boolean, default: true}
});

var Brand = mongoose.model('Brand', BrandSchema);

module.exports = Brand;
