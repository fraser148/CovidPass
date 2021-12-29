"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../models/index"));
const firebase_1 = require("../firebase");
const sequelize_1 = require("sequelize");
const sendgrid_1 = __importDefault(require("../sendgrid"));
const Employee = index_1.default.employee;
const Test = index_1.default.test;
const Company = index_1.default.company;
const Group = index_1.default.group;
const createEmployee = async (req, res) => {
    const { userId, email, name, companyId } = req.body;
    const employee = await Employee.create({
        email,
        name,
        id: userId,
        companyId
    });
    firebase_1.auth.setCustomUserClaims(userId, {
        userRole: "employee",
        company: companyId
    });
    res.send(`Successfully signed ${req.body.name} up!`);
};
const recordTest = async (req, res) => {
    const user = validateUser(req);
    const { result, resultId } = req.body;
    const test = await Test.create({
        testId: resultId,
        result,
        user: user.uid
    });
    res.send("Recorded test result");
};
// Signing up to company and checking Reference Codes!
const checkCompany = async (req, res) => {
    const { ref } = req.params;
    const company = await Company.findOne({
        attributes: ['company', 'id'],
        where: {
            ref
        }
    });
    if (company) {
        res.send(company);
    }
    else {
        res.send({ message: "No Company" });
    }
};
const getStats = async (req, res) => {
    const user = validateUser(req);
    const negative = await Test.count({
        where: {
            result: "negative",
            createdAt: {
                [sequelize_1.Op.gt]: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000)
            }
        },
        include: [{
                model: Employee,
                where: {
                    companyId: user.uid
                }
            }]
    });
    const positive = await Test.count({
        where: {
            result: "positive",
            createdAt: {
                [sequelize_1.Op.gt]: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000)
            }
        },
        include: [{
                model: Employee,
                where: {
                    companyId: user.uid
                }
            }]
    });
    // const tests = await Test.findAll({
    //     attributes: ['createdAt','result'],
    //     where: {
    //         createdAt: {
    //             [Op.gt]: new Date(new Date().getTime() - 10*24*60*60*1000)
    //         }
    //     },
    //     include: [{
    //         attributes:[],
    //         model: Employee,
    //         where: {
    //             companyId: user.uid
    //         }
    //     }]
    // })
    const total = await Test.count({
        where: {
            createdAt: {
                [sequelize_1.Op.gt]: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000)
            }
        },
        include: [{
                model: Employee,
                where: {
                    companyId: user.uid
                }
            }]
    });
    const tests = await Test.findAll({
        // Commmented groups by result too
        // group: [db.sequelize.fn('date',db.sequelize.col('tests.createdAt')), 'result'],
        // attributes: ['result','createdAt',[db.sequelize.fn('COUNT', 'tests.createdAt'), 'testCount']],
        group: [index_1.default.sequelize.fn('date', index_1.default.sequelize.col('tests.createdAt'))],
        attributes: ['createdAt', [index_1.default.sequelize.fn('COUNT', 'tests.createdAt'), 'testCount']],
        where: {
            createdAt: {
                [sequelize_1.Op.gt]: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000)
            }
        },
        include: [{
                attributes: [],
                model: Employee,
                where: {
                    companyId: user.uid
                }
            }]
    });
    var employees = await Employee.findAll({
        where: {
            companyId: user.uid
        },
        include: [{
                model: Test,
                required: false,
                where: {
                    createdAt: {
                        [sequelize_1.Op.gt]: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
                    }
                },
            },
            {
                model: Group
            }],
        order: [['tests', 'createdAt', 'DESC']]
    });
    const tested = employees.filter(employee => employee.tests.length);
    const untested = employees.filter(employee => !employee.tests.length);
    const data = [
        { name: "Untested", value: untested.length },
        { name: "Tested", value: tested.length }
    ];
    const percentage = Math.round(tested.length / (tested.length + untested.length) * 100);
    res.send({ positive, negative, total, tests, percentage });
};
const getEmployees = async (req, res) => {
    const user = validateUser(req);
    // const TODAY_START = new Date(new Date().setHours(0, 0, 0, 0));
    // const NOW = new Date();
    var employees = await Employee.findAll({
        where: {
            companyId: user.uid
        },
        include: [{
                model: Test,
                required: false,
                where: {
                    createdAt: {
                        [sequelize_1.Op.gt]: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                    }
                },
            },
            {
                model: Group
            }],
        order: [['tests', 'createdAt', 'DESC']]
    });
    const tested = employees.filter(employee => employee.tests.length);
    const untested = employees.filter(employee => !employee.tests.length);
    const data = [
        { name: "Untested", value: untested.length },
        { name: "Tested", value: tested.length }
    ];
    res.send({ employees: { tested, untested }, data });
};
const getGroups = async (req, res) => {
    const user = validateUser(req);
    var groups = await Group.findAll({
        where: {
            companyId: user.uid
        },
        include: [{
                model: Employee,
                include: {
                    model: Test,
                    required: false,
                    where: {
                        createdAt: {
                            [sequelize_1.Op.gt]: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                        }
                    },
                }
            }]
    });
    let arr = groups;
    await arr.forEach(group => {
        group.dataValues.count = group.employees.length;
        let tested = group.employees.filter(o => o.tests.length);
        group.dataValues.tested = tested.length;
    });
    console.log();
    res.send(arr);
};
const getGroup = async (req, res) => {
    const user = validateUser(req);
    const { group } = req.params;
    var grouper = await Group.findOne({
        where: {
            companyId: user.uid,
            id: group
        },
        include: [{
                model: Employee,
                include: {
                    model: Test,
                    required: false,
                    where: {
                        createdAt: {
                            [sequelize_1.Op.gt]: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                        }
                    },
                }
            }]
    });
    const tested = grouper.employees.filter(employee => employee.tests.length);
    const untested = grouper.employees.filter(employee => !employee.tests.length);
    const data = [
        { name: "Untested", value: untested.length },
        { name: "Tested", value: tested.length }
    ];
    const group_deets = {
        id: grouper.id,
        group_name: grouper.group_name
    };
    res.send({ employees: { tested, untested }, data, group: group_deets });
};
const sendMail = async (req, res) => {
    const { emails } = req.body;
    await emails.forEach((email) => {
        const msg = {
            to: email.email,
            from: 'covidpass@sauramedia.com',
            subject: 'Covid Reminder',
            templateId: 'd-aaa9941cc1d14314b011fbe9b26e0b9a',
            substitutionWrappers: ['{{', '}}'],
            dynamic_template_data: {
                "name": email.name,
                "date_test": email.test_date,
                "company": email.company
            }
        };
        sendgrid_1.default
            .send(msg);
    })
        .then(() => {
        console.log('Email sent');
        res.send("Email Sent");
    })
        .catch((error) => {
        console.error(error);
        res.status(500).send(error);
    });
};
function validateUser(req) {
    const user = req['currentUser'];
    if (!user) {
        throw new Error('You must be logged in to make this request.');
    }
    return user;
}
exports.default = {
    createEmployee,
    recordTest,
    checkCompany,
    getStats,
    getEmployees,
    getGroups,
    getGroup,
    sendMail
};
//# sourceMappingURL=user.controller.js.map