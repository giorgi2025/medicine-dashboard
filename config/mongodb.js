var mongoose = require('mongoose');

const uri = process.env.NODE_ENV === 'production' 
  ? "mongodb+srv://username:password@cluster0-nhcdz.mongodb.net/brand"
  : "mongodb://localhost:27017/brand";

module.exports = () => {
  mongoose.set('useUnifiedTopology', true);
  return mongoose.connect(uri,{useNewUrlParser: true})
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));
};