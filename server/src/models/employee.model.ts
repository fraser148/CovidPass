const Employee = (sequelize, DataTypes) => sequelize.define("employees", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    fname: {
        type: DataTypes.STRING
    },
    lname: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    companyId: {
        type: DataTypes.STRING
    },
    
});

export default Employee;