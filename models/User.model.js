var mongoose = require('mongoose');
const Schema = mongoose.Schema;
jwt = require('jsonwebtoken');
crypto = require('crypto');
const IV_LENGTH = 16; 

var Config = require('../config/config');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: {type: String, required: true },
    name: {type: String, required: true },
    role: {type: Number, default: 1},       //  0: admin,         1: user
    brands: [{
        _brandId: {type: Schema.Types.ObjectId, ref: "Brand"},
        Submitted: {type: Boolean, default: false },
        Approved: {type: Boolean, default: false },
        Arabic: {type: Boolean, default: false },
        Completed: {type: Boolean, default: false },
        Confirmed: {type: Boolean, default: false },
        Done: {type: Boolean, default: false },    
    }],
    createdTime: {type: Date, default: Date.now },
});

UserSchema.methods.setPassword = function(password) { 
    this.password = SET_PASSWORD_PART(password);
};

UserSchema.methods.getPassword = function() {
    return decrypted_password_from_hash();
}

UserSchema.methods.validatePassword = function(password) {
    return this.getPassword() === password;
}

UserSchema.methods.generateJwt = function() {
    return jwt.sign({
          _id: this._id,
          username: this.username,
          exp: 31556926     //1 year in seconds
        },
        Config.secretKey);
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
