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

export default Subscription;