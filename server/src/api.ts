import express, { NextFunction, Request, Response } from 'express';
import bodyParser   from "body-parser";
import cors from 'cors';
import { handleStripeWebhook } from './webhooks';
import { auth } from './firebase';
import UserRoutes from './routes/user.routes';
import BillingRoutes from './routes/billing.routes';
import db from './models/index';

export const app = express()

app.use(cors({ origin: true }))

const maybe = (fn) => {
    return function(req: Request, res: Response, next: NextFunction) {
        if (req.path === "/company/reference/SAURA" || req.path === "/company/send") {
            next();
        } else {
            fn(req, res, next)
        }
    }
}
app.use(maybe(decodeJWT));

app.use(
    express.json({
        verify: (req, res, buffer) => (req['rawBody'] = buffer),
    })
)

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const Employee = db.employee;
const Test = db.test;
const Company = db.company;

// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial()
// });
db.sequelize.sync()

const initial = async () => {
    await Company.create({
        id: "Aup7O2IoAFfzAoP7yH7ZCEGUsDA2",
        company: "Saura Digital Media",
        address1: "69 Corrour Road",
        address2: "Glasgow",
        country: "United Kingdom",
        postcode: "G43 2ED",
        email: "fraser@sauramedia.com",
        stripeCustomerId: "cus_KmjoDKQ1CaOCxk",
        ref: "SAURA"
    })

    await Employee.bulkCreate([{
        id: "Pw8JnPdaVcSOwQIiDszvNQEh86b2",
        fname: "Fraser",
        lname: "Rennie",
        email: "fjrennie1@outlook.com",
        companyId: "Aup7O2IoAFfzAoP7yH7ZCEGUsDA2"
    },{
        id: "oTEmivOknGWfBN4zmSEmlFPtFwO2",
        fname: "Emily",
        lname: "Luo",
        email: "fraser.rennie@exeter.ox.ac.uk",
        companyId: "Aup7O2IoAFfzAoP7yH7ZCEGUsDA2"
    },{
        id: "FAAILTE",
        fname: "Grant",
        lname: "Rennie",
        email: "grant@failtefoods.com",
        companyId: "Aup7O2IoAFfzAoP7yH7ZCEGUsDA2"
    }]);

    await Test.create({
        testId: "LHG87693484",
        result: "positive",
        user: "Pw8JnPdaVcSOwQIiDszvNQEh86b2",
    })
}

// Catch errors
function runAsync(callback: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
        callback(req, res, next).catch(next);
    }
}

UserRoutes(app);
BillingRoutes(app);

//  WEBHOOKS
app.post('/hooks', runAsync(handleStripeWebhook));

async function decodeJWT(req: Request, res: Response, next: NextFunction) {
     if (req.headers?.authorization?.startsWith('Bearer ')) {
         const idToken = req.headers.authorization.split('Bearer ')[1];

        try {
            const decodedToken = await auth.verifyIdToken(idToken);
            console.log(decodedToken)
            req['currentUser'] = decodedToken;
        } catch (err) {
            console.log(err)
        }
    }
    next();
}