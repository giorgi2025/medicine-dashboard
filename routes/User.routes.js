var user = require("../controllers/User.controller");

module.exports = (app) => {
    app.post("/user/signup", user.signup);
    app.post("/user/login", user.login);
    app.post("/user/allUsers", user.allUsers);
    app.post("/user/addUser", user.signup);
    app.post("/user/updateUser", user.updateUser);
    app.delete("/user/deleteUser/:id", user.deleteUser);
};
