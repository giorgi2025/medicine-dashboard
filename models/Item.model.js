var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ItemSchema = new mongoose.Schema({
    upc: {type: String, required: true},
    _brandId: {type: Schema.Types.ObjectId, ref: "Brand"},
    brand: {type: String, default: ""},
    picture: {type: String, default: ""},
    picture2: {type: String, default: ""},
    title: {type: String, default: ""},
    titleArab: {type: String, default: ""},
    formValue: {type: String, default: ""},
    typeValue: {type: String, default: ""},
    unit: {type: String, default: ""},
    size: {type: String, default: ""},
    description: {type: String, default: ""},
    howToUse: {type: String, default: ""},
    descriptionArab: {type: String, default: ""},
    howToUseArab: {type: String, default: ""},
    comments: {type: String, default: ""},
    lastUpdatedTime: {type: Date, default: Date.now},
    status: {type: String, default: "Submitted"},
});

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
