"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeneralStats = exports.recordTest = exports.createEmployee = void 0;
const firebase_1 = require("./firebase");
const firebase_admin_1 = require("firebase-admin");
async function createEmployee(userId) {
    firebase_1.auth.setCustomUserClaims(userId, { userRole: "employee", company: "Failte Foods" });
}
exports.createEmployee = createEmployee;
async function recordTest(userId, result, resultId) {
    await firebase_1.db
        .collection('tests')
        .add({
        user: userId,
        result: result,
        resultId: resultId,
        timestamp: firebase_admin_1.firestore.FieldValue.serverTimestamp(),
    });
}
exports.recordTest = recordTest;
async function getGeneralStats(company) {
    const tests = await firebase_1.db
        .collection('tests')
        .get();
    return tests.size;
}
exports.getGeneralStats = getGeneralStats;
//# sourceMappingURL=employees.js.map