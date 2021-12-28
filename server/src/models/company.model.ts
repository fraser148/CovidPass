import { DATE } from "sequelize/dist";

const Company = (sequelize, DataTypes) => sequelize.define("companies", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    company: {
        type: DataTypes.STRING
    },
    stripeCustomerId: {
        type: DataTypes.STRING
    },
    address1: {
        type: DataTypes.STRING
    },
    address2: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    postcode: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    ref: {
        type: DataTypes.STRING
    }
});

export default Company;