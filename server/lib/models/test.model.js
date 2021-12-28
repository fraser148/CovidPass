"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Test = (sequelize, DataTypes) => sequelize.define("tests", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    testId: {
        type: DataTypes.STRING
    },
    result: {
        type: DataTypes.STRING
    },
    user: {
        type: DataTypes.STRING
    }
});
exports.default = Test;
//# sourceMappingURL=test.model.js.map