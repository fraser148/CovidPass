"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
require('dotenv').config();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
exports.default = mail_1.default;
//# sourceMappingURL=sendgrid.js.map