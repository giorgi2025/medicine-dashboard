var mongoose = require('mongoose');
const Item = mongoose.model('Item');
const fs = require("fs");
const moment = require('moment');
const json2csv = require('json2csv').parse;
const path = require('path');
var archiver = require('archiver');
const child_process = require('child_process');
const empty = require('empty-folder');

exports.allItems = async (req, res) =>  {

    let items = await Item.find().populate("_brandId");
    return res.json({success: true, items: items});

};

exports.addItem = async (req, res) =>  {

    var product = JSON.parse(req.body.product);
    let newItem = new Item(product);

    await Item.findOne({ upc: product.upc }).then(item => {
        if(item) {
            return res.json({success: false, errMessage: "upc already exists !"});
        } else {
            newItem.save((err) => {
                if (err) {
                    console.log(err)
                    return res.json({success: false, errMessage: "Unknown errors occurred while adding new item."});
                } else {

                    let imageFile = req.files.file;
          
                    imageFile.mv(`client/public/assets/images/items/${req.body.fileName}`, function(err) {
                      if (err) {
                        console.log(err);
                      }
                    });
        
                    Item.find()
                        .populate("_brandId")
                        .exec(function(err, items) {
                            if (err) {
                                return res.json({success: false, errMessage: "Unknown errors occurred while getting all items."});
                            } else {
                                return res.json({success: true, items: items});
                            }
                    });
                }
            }); 
        }
    })
};

exports.updateItem = async (req, res) =>  {

    var product = JSON.parse(req.body.product);
    let itemObj = new Item(product);

    Item.findByIdAndUpdate(itemObj._id, {
        upc: itemObj.upc,
        _brandId: itemObj._brandId,
        picture: itemObj.picture,
        title: itemObj.title,
        titleArab: itemObj.titleArab,
        formValue: itemObj.formValue,
        typeValue: itemObj.typeValue,
        unit: itemObj.unit,
        size: itemObj.size,
        description: itemObj.description,
        howToUse: itemObj.howToUse,
        descriptionArab: itemObj.descriptionArab,
        howToUseArab: itemObj.howToUseArab,
        comments: itemObj.comments,
    }, {
        new: true,
        useFindAndModify: false
    },
    async function(err, item){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while updating item."});
        } else {

            if(req.files !== null) {
                let imageFile = req.files.file;
            
                imageFile.mv(`client/public/assets/images/items/${req.body.fileName}`, function(err) {
                if (err) {
                    console.log(err);
                }
                });
            }

            let items = await Item.find().populate("_brandId");
            return res.json({success: true, items: items});
        }
    });
};

exports.updateItemStatus = async (req, res) =>  {

    let itemObj = new Item(req.body);

    Item.findByIdAndUpdate(itemObj._id, {
        status: itemObj.status,
    }, {
        new: true,
        useFindAndModify: false
    },
    async function(err, item){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while updating item."});
        } else {
            let items = await Item.find().populate("_brandId");
            return res.json({success: true, items: items});
        }
    });
};

exports.deleteItem = (req,res) => {
    var id = req.params.id;

    Item.findByIdAndRemove(id, {
        new: true,
        useFindAndModify: false
    }, async function(err, item){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while deleting item."});
        } else {
            let items = await Item.find().populate("_brandId");
            return res.json({success: true, items: items});
        }
    });

};

exports.CSV = async (req, res) =>  {  
    // const pathToFile = path.join(__dirname,"..","client","public","assets","images","items","upc-1234.jpeg")
    // const pathToNewDestination = path.join(__dirname,"..", "csv", "your-file-copy.png")

    // fs.copyFile(pathToFile, pathToNewDestination, function(err) {
    // if (err) {
    //     throw err
    // } else {
    //     console.log("Successfully copied and moved the file!")
    // }
    // });
    // const folderpath = path.join(__dirname,"..", "csv");
    // child_process.execSync(`zip -r archive *`, {
    //     cwd: folderpath
    // });
    // res.download(folderpath + '/archive.zip');

    var CSVData = [];
    var fields = [];
    Item.find({_brandId: req.params.brandId, status: req.params.cat}).lean().exec({}, function(err, data) {
        for(var i = 0; i < data.length; i++) {
            delete data[i]['__v'];
            delete data[i]['_id'];
            delete data[i]['_brandId'];
            delete data[i]['lastUpdatedTime'];
        }
        CSVData = data;
        CSVData.map((row,index) => {
            const pathToFile = path.join(__dirname,"..","client","public","assets","images","items",`${row.picture}`)
            const pathToNewDestination = path.join(__dirname,"..", "csv", `${row.picture}`);
            fs.copyFile(pathToFile, pathToNewDestination, function(err) {
                if (err) {
                    throw err
                } else {
                    console.log("Successfully copied and moved the file!")
                }
            });
        })
        fields = ['upc','title','titleArab','formValue','typeValue','unit','size','description','howToUse','descriptionArab','howToUseArab','comments','status'] 
       
        if (err) res.send(err);   
        let csv;
        
        try {
          csv = json2csv(CSVData, { fields });
        } catch (err) {
            
          return res.status(500).json({ err });
        }
        const dateTime = moment().format('YYYYMMDDhhmmss');
        const filePath = path.join(__dirname, "..", "csv", "csv-" + dateTime + ".csv")
        fs.writeFile(filePath, csv, function (err) {
            if (err) {
                console.log(err)
              return res.json(err).status(500);
            }
            else {

                const folderpath = path.join(__dirname,"..", "csv");
                child_process.execSync(`zip -r archive *`, {
                    cwd: folderpath
                });
                setTimeout(function () {
                    // fs.unlink(filePath, function (err) { // delete this file after 30 seconds
                    //     if (err) {
                    //         console.error(err);
                    //     }
                    //     console.log('File has been Deleted');
                    // });
                    empty(folderpath, false, (o)=>{
                        if(o.error) console.error(o.error);
                    });
    
                }, 6000);
                res.download(folderpath + '/archive.zip');
            }
        });
    });                
      
};
