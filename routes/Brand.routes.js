var brand = require("../controllers/Brand.controller");

module.exports = (app) => {
    app.post("/brand/allBrands", brand.allBrands);
    app.post("/brand/addBrand", brand.addBrand);
    app.post("/brand/updateBrand", brand.updateBrand);
    app.post("/brand/deleteBrand/:id", brand.deleteBrand);
    app.post("/brand/activateBrand/:id", brand.activateBrand);
};
