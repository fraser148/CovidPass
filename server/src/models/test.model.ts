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

export default Test;