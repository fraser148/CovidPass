"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const UserRoutes = (app) => {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    app.post("/employee/create/", user_controller_1.default.createEmployee);
    app.post("/employee/result/", user_controller_1.default.recordTest);
    app.get("/company/reference/:ref", user_controller_1.default.checkCompany);
    app.get("/company/stats", user_controller_1.default.getStats);
    app.get("/company/employees", user_controller_1.default.getEmployees);
    app.get("/company/groups", user_controller_1.default.getGroups);
    app.get("/company/group/:group", user_controller_1.default.getGroup);
    app.post("/company/send", user_controller_1.default.sendMail);
};
exports.default = UserRoutes;
//# sourceMappingURL=user.routes.js.map