var mongoose = require('mongoose');
const Schema = mongoose.Schema;
jwt = require('jsonwebtoken');
crypto = require('crypto');
const IV_LENGTH = 16; // For AES, this is always 16

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
    let salt =  Config.salt;
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(salt), iv);
    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
   
    this.password = iv.toString('hex') + 'g' + encrypted.toString('hex');
};

UserSchema.methods.getPassword = function() {

    let salt = Config.salt;
    let textParts = this.password.split('g');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join('g'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(salt), iv);
    let decrypted = decipher.update(encryptedText);
   
    decrypted = Buffer.concat([decrypted, decipher.final()]);
   
    return decrypted.toString();
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
