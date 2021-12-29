import sgMail from "@sendgrid/mail";
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export default sgMail;