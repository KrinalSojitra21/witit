interface ErrorCodes {
  [key: string]: string;
}

const errorCodes: ErrorCodes = {
  "auth/email-already-exists": "Email Already Registered!",
  "auth/email-already-in-use": "Email Already Registered!",
  "auth/invalid-continue-uri": "Invalid Success URL",
  "auth/invalid-email": "Invalid Email",
  "auth/invalid-password": "Invalid Password",
  "auth/wrong-password": "Incorrect Password",
  "auth/invalid-uid": "Invalid User Id",
  "auth/user-not-found": "User Not Found",
  "auth/too-many-requests":"Try After Sometime"
};

const getFirebaseErrorMessage = async (code: string) => {
  if (errorCodes[code]) return errorCodes[code];
  return code;
};

export default getFirebaseErrorMessage;
