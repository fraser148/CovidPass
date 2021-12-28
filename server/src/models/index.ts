import config           from "../config/db.config";
import Employee         from "./employee.model";
import Company          from "./company.model";
import Test             from './test.model';
import Subscription     from "./subscription.model";
import Group            from "./group.model";
import { Sequelize, DataTypes }    from 'Sequelize';


const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: 'mysql' // watch out for no variable (should come from config file)
    }
);


const db:any = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.employee = Employee(sequelize, DataTypes)
db.company = Company(sequelize, DataTypes)
db.test = Test(sequelize, DataTypes)
db.subscription = Subscription(sequelize, Sequelize)
db.group = Group(sequelize, Sequelize)

db.company.hasMany(db.employee, { foreignKey: "companyId"})
db.employee.hasMany(db.test, {foreignKey: "user"});
db.test.belongsTo(db.employee, {foreignKey: "user"});
db.company.hasMany(db.subscription)
db.company.hasMany(db.group);
db.employee.belongsTo(db.group, { foreignKey: "department"});
db.group.hasMany(db.employee, { foreignKey: "department"})

export default db;