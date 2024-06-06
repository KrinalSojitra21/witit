import auth from "@/utils/firebase/firebaseConfig";
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  User,
} from "firebase/auth";

interface res {
  status: number;
  data: any;
  msg: string;
  error: any;
}

export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      },
      reject
    );
  });
};

export function onAuth(callback: any) {
  auth.onAuthStateChanged(callback);
}

export const LoginToAccount = async (email: string, password: string) => {
  let res: res = { status: 0, data: "", msg: "", error: "" };

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    res.status = 200;
    res.data = userCredential?.user;
  } catch (error: any) {
    res.status = 0;
    res.error = error.code;
  }
  return res;
};

export const ResetAccountPassword = async (email: string) => {
  let res: res = { status: 0, data: "", msg: "", error: "" };

  try {
    const result = await sendPasswordResetEmail(auth, email);
    res.status = 200;
    res.msg = "Email Sent Successfully!";
  } catch (error: any) {
    res.status = 0;
    res.error = error.code;
  }
  return res;
};

export const signUpToFirebase = async (email: string, password: string) => {
  let res: any = { status: 0, data: "", msg: "", error: "" };

  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      await sendEmail(user);
      res.status = 200;
      // ...
    })
    .catch((error) => {
      res.error = error.code;
      res.msg = error.message;
      // ..
    });
  return res;
};

export const sendEmail = async (user: User) => {
  let res: any = { status: 0, data: "", msg: "", error: "" };

  var actionCodeSettings = {
    url:
      window.location.protocol +
      "//" +
      window.location.host +
      "/account-setup?email=" +
      user?.email,
    handleCodeInApp: true,
  };

  try {
    await sendEmailVerification(user, actionCodeSettings);
    res.status = 200;
  } catch (error: any) {
    console.log(error);
    res.error = error.code;
  }
  console.log(res);
  return res;
};

export const firebaseLogout = async () => {
  let res = { status: 0, data: "", error: "" };

  try {
    const data = await signOut(auth);
    console.log("d:-----", data);
    res.status = 200;
  } catch (error: any) {
    res.status = 0;
    res.error = error.code;
  }

  return res;
};
