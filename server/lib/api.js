"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const webhooks_1 = require("./webhooks");
const firebase_1 = require("./firebase");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const billing_routes_1 = __importDefault(require("./routes/billing.routes"));
const index_1 = __importDefault(require("./models/index"));
exports.app = express_1.default();
exports.app.use(cors_1.default({ origin: true }));
const maybe = (fn) => {
    return function (req, res, next) {
        if (req.path === "/company/reference/SAURA" || req.path === "/company/send") {
            next();
        }
        else {
            fn(req, res, next);
        }
    };
};
exports.app.use(maybe(decodeJWT));
exports.app.use(express_1.default.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
}));
exports.app.use(body_parser_1.default.json());
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
const Employee = index_1.default.employee;
const Test = index_1.default.test;
const Company = index_1.default.company;
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial()
// });
index_1.default.sequelize.sync();
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
    });
    await Employee.bulkCreate([{
            id: "Pw8JnPdaVcSOwQIiDszvNQEh86b2",
            fname: "Fraser",
            lname: "Rennie",
            email: "fjrennie1@outlook.com",
            companyId: "Aup7O2IoAFfzAoP7yH7ZCEGUsDA2"
        }, {
            id: "oTEmivOknGWfBN4zmSEmlFPtFwO2",
            fname: "Emily",
            lname: "Luo",
            email: "fraser.rennie@exeter.ox.ac.uk",
            companyId: "Aup7O2IoAFfzAoP7yH7ZCEGUsDA2"
        }, {
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
    });
};
// Catch errors
function runAsync(callback) {
    return (req, res, next) => {
        callback(req, res, next).catch(next);
    };
}
user_routes_1.default(exports.app);
billing_routes_1.default(exports.app);
//  WEBHOOKS
exports.app.post('/hooks', runAsync(webhooks_1.handleStripeWebhook));
async function decodeJWT(req, res, next) {
    var _a, _b;
    if ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        try {
            const decodedToken = await firebase_1.auth.verifyIdToken(idToken);
            console.log(decodedToken);
            req['currentUser'] = decodedToken;
        }
        catch (err) {
            console.log(err);
        }
    }
    next();
}
//# sourceMappingURL=api.js.map