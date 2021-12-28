import { auth } from './firebase';
// const API = 'https://stripe-server-apw6lsu5yq-uc.a.run.app';
const API = 'http://localhost:3333';

/**
 * A helper function to fetch data from your API.
 * It sets the Firebase auth token on the request.
 */
export async function fetchFromAPI(endpointURL, opts) {
  const { method, body } = { method: 'POST', body: null, ...opts };

  const user = auth.currentUser;
  const token = user && (await user.getIdToken(true));

  const res = await fetch(`${API}/${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export const isUserPremium = async () => {
  await auth.currentUser.getIdToken(true);
  const decodedToken = await auth.currentUser.getIdTokenResult();
  console.log("decodedToken", decodedToken.claims.userPlan); // output is undefined, stripeRole doesn't exist :( more on that below
  return decodedToken.claims.userPlan;
}

export const isEmployee = async () => {
  await auth.currentUser.getIdToken(true);
  const decodedToken = await auth.currentUser.getIdTokenResult();
  console.log("decodedToken", decodedToken.claims.userRole); // output is undefined, stripeRole doesn't exist :( more on that below
  return decodedToken.claims.userRole;
}
