"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("../config/db.config"));
const employee_model_1 = __importDefault(require("./employee.model"));
const company_model_1 = __importDefault(require("./company.model"));
const test_model_1 = __importDefault(require("./test.model"));
const subscription_model_1 = __importDefault(require("./subscription.model"));
const group_model_1 = __importDefault(require("./group.model"));
const Sequelize_1 = require("Sequelize");
const sequelize = new Sequelize_1.Sequelize(db_config_1.default.DB, db_config_1.default.USER, db_config_1.default.PASSWORD, {
    host: db_config_1.default.HOST,
    dialect: 'mysql' // watch out for no variable (should come from config file)
});
const db = {};
db.Sequelize = Sequelize_1.Sequelize;
db.sequelize = sequelize;
db.employee = employee_model_1.default(sequelize, Sequelize_1.DataTypes);
db.company = company_model_1.default(sequelize, Sequelize_1.DataTypes);
db.test = test_model_1.default(sequelize, Sequelize_1.DataTypes);
db.subscription = subscription_model_1.default(sequelize, Sequelize_1.Sequelize);
db.group = group_model_1.default(sequelize, Sequelize_1.Sequelize);
db.company.hasMany(db.employee, { foreignKey: "companyId" });
db.employee.hasMany(db.test, { foreignKey: "user" });
db.test.belongsTo(db.employee, { foreignKey: "user" });
db.company.hasMany(db.subscription);
db.company.hasMany(db.group);
db.employee.belongsTo(db.group, { foreignKey: "department" });
db.group.hasMany(db.employee, { foreignKey: "department" });
exports.default = db;
//# sourceMappingURL=index.js.map