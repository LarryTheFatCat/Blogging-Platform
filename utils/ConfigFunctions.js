import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "./firebase"

export const doCreateUsersWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
}