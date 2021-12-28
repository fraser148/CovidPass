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

export default Group;