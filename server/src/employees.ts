import { db, auth } from './firebase';
import { firestore } from 'firebase-admin';

export async function createEmployee(userId:string) {
    auth.setCustomUserClaims(userId, {userRole: "employee", company: "Failte Foods"})
}

export async function recordTest(userId: string, result: string, resultId: string) {
    await db
        .collection('tests')
        .add({
            user: userId,
            result: result,
            resultId: resultId,
            timestamp: firestore.FieldValue.serverTimestamp(),
        })
}

export async function getGeneralStats(company: string) {
    const tests = await db
        .collection('tests')
        .get()
    return tests.size
        
}