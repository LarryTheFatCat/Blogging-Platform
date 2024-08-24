import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./Firebase";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}
export const doSignInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}
export const doSignOut = async () => {
    return signOut(auth);
}