"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subscription = (sequelize, DataTypes) => sequelize.define("subscriptions", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    priceId: {
        type: DataTypes.STRING
    },
    companyId: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    }
});
exports.default = Subscription;
//# sourceMappingURL=subscription.model.js.map