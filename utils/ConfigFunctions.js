import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

export const doCreateUsersWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}
export const doSignInUsersWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}
export const doSignOut = async () => {
    return signOut(auth);
}