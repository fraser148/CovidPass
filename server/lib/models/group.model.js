"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Group = (sequelize, DataTypes) => sequelize.define("groups", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    group_name: {
        type: DataTypes.STRING
    },
    companyId: {
        type: DataTypes.STRING
    }
});
exports.default = Group;
//# sourceMappingURL=group.model.js.map