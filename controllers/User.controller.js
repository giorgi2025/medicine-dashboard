var mongoose = require('mongoose');
passport = require('passport');
const User = mongoose.model('User');

exports.login = async (req, res) =>  {  
    await User.findOne({username: req.body.username }).then(async user => {
        if(!user) {
            return res.json({success: false, errMessage: "username not found. Please confirm your username again!"});
        } else {
            let result = user.validatePassword(req.body.password);
            if(!result) {
                return res.json({success: false, errMessage: "Password is wrong. Please confirm your password again!"});
            } else {
                let token = user.generateJwt();
                let result = await User.findOne({username: req.body.username}).populate("brands._brandId");
                res.json({success: true, token: token, user: result});
            }
        }
    })
};

exports.signup = async (req, res) =>  {
    await User.findOne({ username: req.body.username }).then(user => {
        if(user) {
            return res.json({success: false, errMessage: "Username already exists"});
        } else {
            let user = new User(req.body);
            user.setPassword(req.body.password);
            user.save(async (err) => {
                if (err) {
                    return res.json({success: false, errMessage: "Unknown errors occurred while registering."});
                } else {
                    let users = await User.find({role: 1}).populate("brands._brandId");
                    return res.json({success: true, users: users});
                }
            }); 
        }
    })
};

exports.allUsers = async (req, res) =>  {
    User.find({role: 1})
        .populate("brands._brandId")
        .exec(function(err, users) {
        if (err) {
            return res.json({success: false, errMessage: "Unknown errors occurred while getting all users."});
        } else {
            return res.json({success: true, users: users});
        }
    });

};

exports.updateUser = async (req, res) =>  {

    let userObj = new User(req.body);
    // userObj.setPassword(req.body.password);

    User.findByIdAndUpdate(userObj._id, {
        username: userObj.username,
        // password: userObj.password,
        name: userObj.name,
        brands: userObj.brands,
    }, {
        new: true,
        useFindAndModify: false
    }, async function(err, user){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while updating user."});
        } else {
            let users = await User.find({role: 1}).populate("brands._brandId");
            return res.json({success: true, users: users});
        }
    });
};

exports.deleteUser = (req,res) => {
    var id = req.params.id;

    User.findByIdAndRemove(id, {
        new: true,
        useFindAndModify: false
    }, async function(err, user){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while deleting user."});
        } else {
            let users = await User.find({role: 1}).populate("brands._brandId");
            return res.json({success: true, users: users});
        }
    });

};