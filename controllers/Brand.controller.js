var mongoose = require('mongoose');
const Brand = mongoose.model('Brand');
const path = require('path');

exports.allBrands = async (req, res) =>  {

    let brands = await Brand.find();
    return res.json({success: true, brands: brands});

};

exports.addBrand = async (req, res) =>  {

    var product = JSON.parse(req.body.product);
    let brand = new Brand(product);

    await Brand.findOne({ name: product.name }).then(existBrand => {
        if(existBrand) {
            return res.json({success: false, errMessage: "Brandname already exists"});
        } else {
            brand.save((err) => {
                if (err) {
                    console.log(err)
                    return res.json({success: false, errMessage: "Unknown errors occurred while adding."});
                } else {
                    
                    let imageFile = req.files.file;
                    const filePath = path.join(__dirname, "..", "client","public","assets","images","brands",`${req.body.fileName}`);
                    imageFile.mv(filePath, function(err) {
                      if (err) {
                        console.log(err);
                      }
                    });
 
                    Brand.find()
                        .exec(function(err, brands) {
                        if (err) {
                            return res.json({success: false, errMessage: "Unknown errors occurred while getting all brands."});
                        } else {
                            return res.json({success: true, brands: brands});
                        }
                    });
                }
            }); 
        }
    })
};

exports.updateBrand = async (req, res) =>  {

    var product = JSON.parse(req.body.product);
    let brandObj = new Brand(product);

    Brand.findByIdAndUpdate(brandObj._id, {
        name: brandObj.name,
        picture: brandObj.picture,
        allow: brandObj.allow,
    }, {
        new: true,
        useFindAndModify: false
    },
    function(err, brand){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while updating brand."});
        } else {

            if(req.files !== null) {
                let imageFile = req.files.file;
            
                imageFile.mv(`client/public/assets/images/brands/${req.body.fileName}`, function(err) {
                if (err) {
                    console.log(err);
                }
                });
            }

            Brand.find()
                .exec(function(err, brands) {
                if (err) {
                    return res.json({success: false, errMessage: "Unknown errors occurred while getting all brands."});
                } else {
                    return res.json({success: true, brands: brands});
                }
            });
        }
    });
};

exports.deleteBrand = (req,res) => {
    var id = req.params.id;

    Brand.findByIdAndUpdate(id, {
        allow: false,
    }, {
        new: true,
        useFindAndModify: false
    },
    function(err, brand){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while deleting brand."});
        } else {
            Brand.find()
                .exec(function(err, brands) {
                if (err) {
                    return res.json({success: false, errMessage: "Unknown errors occurred while getting all brands."});
                } else {
                    return res.json({success: true, brands: brands});
                }
            });
        }
    });

};

exports.activateBrand = (req,res) => {
    var id = req.params.id;

    Brand.findByIdAndUpdate(id, {
        allow: true,
    }, {
        new: true,
        useFindAndModify: false
    },
    function(err, brand){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while activating brand."});
        } else {
            Brand.find()
                .exec(function(err, brands) {
                if (err) {
                    return res.json({success: false, errMessage: "Unknown errors occurred while getting all brands."});
                } else {
                    return res.json({success: true, brands: brands});
                }
            });
        }
    });

};