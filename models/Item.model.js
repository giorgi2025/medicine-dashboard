var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ItemSchema = new mongoose.Schema({
    upc: {type: String, required: true},
    _brandId: {type: Schema.Types.ObjectId, ref: "Brand"},
    picture: {type: String, required: true},
    title: {type: String, required: true},
    titleArab: {type: String, required: true},
    formValue: {type: String, required: true},
    typeValue: {type: String, required: true},
    unit: {type: String, required: true},
    size: {type: String, required: true},
    description: {type: String, required: true},
    howToUse: {type: String, required: true},
    descriptionArab: {type: String, required: true},
    howToUseArab: {type: String, required: true},
    comments: {type: String, required: true},
    lastUpdatedTime: {type: Date, default: Date.now},
    status: {type: String, default: "Submitted"},
});

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
