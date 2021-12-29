import { Request, Response }    from "express";
import db                       from "../models/index";
import { auth }                 from "../firebase"
import { Op }                   from 'sequelize';
import sgMail                   from "../sendgrid";


const Employee = db.employee;
const Test = db.test
const Company = db.company;
const Group = db.group;

const createEmployee = async (req: Request, res: Response) => {
    const {userId, email, name, companyId} = req.body;
    const employee = await Employee.create({
        email,
        name,
        id: userId,
        companyId
    });
    auth.setCustomUserClaims(userId, {
        userRole: "employee",
        company: companyId
    });
    res.send(`Successfully signed ${req.body.name} up!`);

}

const recordTest = async (req: Request, res: Response) => {
    const user = validateUser(req);
    const { result, resultId } = req.body;
    const test = await Test.create({
        testId: resultId,
        result,
        user: user.uid
    });
    res.send("Recorded test result")
}

// Signing up to company and checking Reference Codes!

const checkCompany = async (req: Request, res: Response) => {
    const { ref } = req.params;
    const company = await Company.findOne({
        attributes: ['company','id'],
        where: {
            ref
        }
    });
    if (company) {
        res.send(company);
    } else {
        res.send({message: "No Company"})
    }
}

const getStats = async  (req: Request, res: Response) => {
    const user = validateUser(req);
    const negative = await Test.count({
        where: {
            result: "negative",
            createdAt: {
                [Op.gt]: new Date(new Date().getTime() - 10*24*60*60*1000)
            }
        },
        include: [{
            model: Employee,
            where: {
                companyId: user.uid
            }
        }]
    })
    const positive = await Test.count({
        where: {
            result: "positive",
            createdAt: {
                [Op.gt]: new Date(new Date().getTime() - 10*24*60*60*1000)
            }
        },
        include: [{
            model: Employee,
            where: {
                companyId: user.uid
            }
        }]
    })
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
                [Op.gt]: new Date(new Date().getTime() - 10*24*60*60*1000)
            }
        },
        include: [{
            model: Employee,
            where: {
                companyId: user.uid
            }
        }]
    })
    const tests = await Test.findAll({
        // Commmented groups by result too
        // group: [db.sequelize.fn('date',db.sequelize.col('tests.createdAt')), 'result'],
        // attributes: ['result','createdAt',[db.sequelize.fn('COUNT', 'tests.createdAt'), 'testCount']],
        group: [db.sequelize.fn('date',db.sequelize.col('tests.createdAt'))],
        attributes: ['createdAt',[db.sequelize.fn('COUNT', 'tests.createdAt'), 'testCount']],
        where: {
            createdAt: {
                [Op.gt]: new Date(new Date().getTime() - 10*24*60*60*1000)
            }
        },
        include: [{
            attributes:[],
            model: Employee,
            where: {
                companyId: user.uid
            }
        }]
    })
    var employees = await Employee.findAll({
        where: {
            companyId: user.uid
        },
        include: [{
            model: Test,
            required: false,
            where: {
                createdAt: {
                    [Op.gt]: new Date(new Date().getTime() - 2*24*60*60*1000)
                }
            },
        },
        {
            model: Group
        }],
        order: [['tests','createdAt','DESC']]
    });

    const tested = employees.filter(employee => employee.tests.length);
    const untested = employees.filter(employee => !employee.tests.length);
    const data = [
        {name: "Untested", value: untested.length},
        {name: "Tested", value: tested.length}
    ]
    const percentage = Math.round(tested.length/(tested.length + untested.length)*100)
    res.send({positive, negative, total, tests, percentage})
}

const getEmployees = async (req: Request, res: Response) => {
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
                    [Op.gt]: new Date(new Date().getTime() - 24*60*60*1000)
                }
            },
        },
        {
            model: Group
        }],
        order: [['tests','createdAt','DESC']]
    });

    const tested = employees.filter(employee => employee.tests.length);
    const untested = employees.filter(employee => !employee.tests.length);
    const data = [
        {name: "Untested", value: untested.length},
        {name: "Tested", value: tested.length}
    ]
    res.send({employees: {tested, untested}, data})
}

const getGroups = async (req: Request, res: Response) => {
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
                        [Op.gt]: new Date(new Date().getTime() - 24*60*60*1000)
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

    console.log()

    res.send(arr);
}

const getGroup = async (req: Request, res: Response) => {
    const user = validateUser(req);

    const { group } = req.params
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
                        [Op.gt]: new Date(new Date().getTime() - 24*60*60*1000)
                    }
                },
            }
        }]
    });

    const tested = grouper.employees.filter(employee => employee.tests.length);
    const untested = grouper.employees.filter(employee => !employee.tests.length);
    const data = [
        {name: "Untested", value: untested.length},
        {name: "Tested", value: tested.length}
    ];
    const group_deets = {
        id: grouper.id,
        group_name: grouper.group_name
    }
    res.send({employees: {tested, untested}, data, group: group_deets});
}

const sendMail = async (req: Request, res: Response) => {
    type Email = {
        name: string,
        company: string,
        test_date: string,
        email: string
    };
    
    const { emails } = req.body
    await emails.forEach((email: Email) => {
        const msg = {
            to: email.email,
            from: 'covidpass@sauramedia.com',
            subject: 'Covid Reminder',
            templateId: 'd-aaa9941cc1d14314b011fbe9b26e0b9a',
            substitutionWrappers: ['{{', '}}'],
            dynamic_template_data: {
                "name" : email.name,
                "date_test" : email.test_date,
                "company" : email.company
            }
           };
        sgMail
        .send(msg)
    })
    .then(() => {
        console.log('Email sent')
        res.send("Email Sent")
    })
    .catch((error) => {
        console.error(error)
        res.status(500).send(error)
    })
    
}

function validateUser(req: Request) {
    const user = req['currentUser'];
    if (!user) {
        throw new Error(
            'You must be logged in to make this request.'
        )
    }
    return user;
}

export default {
    createEmployee,
    recordTest,
    checkCompany,
    getStats,
    getEmployees,
    getGroups,
    getGroup,
    sendMail
}