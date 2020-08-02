var item = require("../controllers/Item.controller");

module.exports = (app) => {
    app.post("/item/allItems", item.allItems);
    app.post("/item/addItem", item.addItem);
    app.post("/item/updateItem", item.updateItem);
    app.post("/item/updateItemStatus", item.updateItemStatus);
    app.delete("/item/deleteItem/:id", item.deleteItem);
    app.post("/exportCSV/:brandId/:cat",item.CSV);
};
