import { doCreateUsersWithEmailAndPassword, doSignInUsersWithEmailAndPassword } from "@/utils/ConfigFunctions";
import { auth, db } from "@/utils/firebase";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import GoogleButton from "react-google-button";

export default function AuthenticationUI() {
    const router = useRouter();
    const provider = new GoogleAuthProvider;
    const [register, setRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    // Login state values
    const [loginInput, setLoginInput] = useState({
        email: "",
        password: ""
    });
    // Register state values
    const [registerInput, setRegisterInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    // errorState for isValid
    const [errorState, setErrorState] = useState({
        username: false,
        password: false,
        email: false,
        loginUsername: false,
        loginPassword: false,
    });
    // errorMessage for when errorState === true
    const [errorMessage, setErrorMessage] = useState({
        username: "",
        email: "",
        password: "",
        loginUsername: "",
        loginPassword: "",
    });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Updates register state values
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterInput({ ...registerInput, [name]: value });
    }
    // constant check for when the user enters information, display error until true
    const handleUsernameChange = (e) => {
        let usernameValue = e.target.value;
        if (usernameValue.length < 3) {
            setErrorState(
                {
                    ...errorState,
                    username: true,
                    loginUsername: true
                }
            );
            setErrorMessage(
                {
                    ...errorMessage,
                    username: "Please set a username to be greater than 3 characters",
                    loginUsername: "Please set a username to be greater than 3 characters"
                }
            );
        } else {
            setErrorState({
                ...errorState,
                username: false,
                loginUsername: false,
            });
            setErrorMessage({
                ...errorMessage,
                username: "",
                loginUsername: "",
            });
        }
    }
    // constant check for when the user enters information, display error until true
    const handleEmailChange = (e) => {
        let emailValue = e.target.value;
        if (!emailRegex.test(emailValue)) {
            setErrorState(
                {
                    ...errorState, email: true
                });
            setErrorMessage({ ...errorMessage, email: "Invalid Email" });
        } else {
            setErrorState(
                {
                    ...errorState,
                    email: false
                }
            );
            setErrorMessage(
                {
                    ...errorMessage,
                    email: ""
                }
            );
        }
    }
    // constant check for when the user enters information, display error until true
    const handlePasswordChange = (e) => {
        let passwordValue = e.target.value;
        if (passwordValue.length < 8) {
            setErrorState(
                {
                    ...errorState,
                    password: true,
                    loginPassword: true,
                }
            );
            setErrorMessage(
                {
                    ...errorMessage,
                    password: "Password length must be greater than or equal to 8 characters.",
                    loginPassword: "Password length must be greater than or equal to 8 characters."
                }
            )
        } else {
            setErrorState(
                {
                    ...errorState,
                    password: false,
                    loginPassword: false,
                }
            );
            setErrorMessage(
                {
                    ...errorMessage,
                    password: "",
                    loginPassword: "",
                }
            );
        }
    }
    // Obtains the information generated from above and if all is true, it then performs a final check but for more specific values all at once to see if they are all true
    // On the event that it returns true, then it calls the function doCreateUsersWithEmailAndPassword passing through the correct parameters
    // Sending the users information to the Firebase Authentication DB and the Firestore DB, with the following information being stored:
    // - Firebase Authentication
    // * Email
    // * Password
    // UID
    // - Firestore DB
    // * Email
    // * Password
    // * Username
    // * UID
    // Then setRegister(false) displays the login screen
    // if the checks fail, it returns an error... that's all
    const registerAccountToFireBase = async () => {
        try {
            if (emailRegex.test(registerInput.email) && registerInput.username.length > 3 && registerInput.password.length >= 8) {
                setLoading(true);
                let userCreds = await doCreateUsersWithEmailAndPassword(registerInput.email, registerInput.password);
                const uid = userCreds.user.uid;
                await setDoc(doc(db, "users", uid), {
                    email: registerInput.email,
                    password: registerInput.password,
                    username: registerInput.username,
                    uid: uid
                }).then(() => {
                    setLoading(false);
                    setRegister(false);
                })
            } else if (registerInput.username.length === 0 || registerInput.password.length === 0 || registerInput.email.length === 0) {
                setErrorState({
                    username: registerInput.username.length === 0,
                    email: registerInput.username.length === 0,
                    password: registerInput.password.length === 0
                });
                setErrorMessage({
                    username: registerInput.username.length === 0 ? "Please enter a valid username" : "",
                    email: registerInput.email.length === 0 ? "Please enter a valid email" : "",
                    password: registerInput.password.length === 0 ? "Please enter a password greater than or equal to 8 characters" : ""
                });
            } else {
                setErrorState({
                    username: registerInput.username.length <= 3,
                    email: !emailRegex.test(registerInput.email),
                    password: registerInput.password.length < 8
                });
                setErrorMessage({
                    username: registerInput.username.length <= 3 ? "Please enter a valid username" : "",
                    email: !emailRegex.test(registerInput.email) ? "Please enter a valid email" : "",
                    password: registerInput.password.length < 8 ? "Please enter a password greater than or equal to 8 characters" : ""
                });
            }
        } finally {
            setLoading(false);
        }
    }
    const handleLoginChange = (e) => {
        let { name, value } = e.target;
        setLoginInput({ ...loginInput, [name]: value });
    }
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const uid = user.uid;
            await setDoc(doc(db, "users", uid), {
                email: user.email,
                username: user.displayName,
                uid: uid
            });
            router.push(`${uid}/`);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };
    const authenticateLoginInfo = async () => {
        let userCreds = await doSignInUsersWithEmailAndPassword(loginInput.email, loginInput.password);
        let uid = userCreds.user.uid;
        router.push(`${uid}/`)
    }
    return (
        <div className="bg-desktop-background bg-cover h-screen bg-repeat flex justify-center items-center">
            <div className="sm:px-40 sm:py-20 backdrop-filter backdrop-blur-sm border-2 border-white rounded-3xl">
                {register ?
                    <Card className="backdrop-filter backdrop-blur-sm bg-opacity-40 sm:p-4 md:w-[500px]">
                        <CardHeader>
                            <h1 className="text-2xl font-bold capitalize tracking-wider max-sm:ml-2">
                                Register
                            </h1>
                        </CardHeader>
                        <CardBody className="gap-y-4">
                            <Input
                                isInvalid={errorState.username}
                                errorMessage={errorMessage.username}
                                onKeyUp={handleUsernameChange}
                                value={registerInput.username}
                                onChange={handleChange}
                                name="username"
                                isRequired
                                label="Username"
                                variant="bordered"
                                placeholder="Enter your username"
                                description="Your username must be unique, you can change it later."
                                isClearable
                            />
                            <Input
                                isInvalid={errorState.email}
                                errorMessage={errorMessage.email}
                                onKeyUp={handleEmailChange}
                                value={registerInput.email}
                                onChange={handleChange}
                                name="email"
                                isRequired
                                label="Email"
                                variant="bordered"
                                placeholder="Enter your email"
                                description="Enter a valid email address. You must verify it later."
                                isClearable
                            />
                            <Input
                                isInvalid={errorState.password}
                                errorMessage={errorMessage.password}
                                onKeyUp={handlePasswordChange}
                                type="password"
                                value={registerInput.password}
                                onChange={handleChange}
                                name="password"
                                isRequired
                                label="Password"
                                variant="bordered"
                                placeholder="Enter your password"
                                description="Remember, we don't share your password with anyone."
                                isClearable
                            />
                            <Button onClick={registerAccountToFireBase} isLoading={loading} color="primary" variant="solid" className="w-4/6 sm:w-5/6 md:w-96 mx-auto">
                                Register
                            </Button>
                            <p className="text-center text-xs text-gray-500">
                                Already have an account? <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => setRegister(false)}>Login here</span>
                            </p>
                        </CardBody>
                    </Card>
                    :
                    <Card className="backdrop-filter backdrop-blur-sm bg-opacity-40 sm:p-4 md:w-[400px]">
                        <CardHeader>
                            <h1 className="text-2xl font-bold capitalize tracking-wider">
                                Login
                            </h1>
                        </CardHeader>
                        <CardBody className="gap-y-4">
                            <Input
                                isInvalid={errorState.loginUsername}
                                errorMessage={errorMessage.loginUsername}
                                value={loginInput.email}
                                onChange={handleLoginChange}
                                name="email"
                                onKeyUp={handleUsernameChange}
                                isRequired
                                label="Email"
                                variant="bordered"
                                placeholder="Enter your email"
                                description="Remember, we don't share your email with anyone."
                                isClearable
                            />
                            <Input
                                isInvalid={errorState.loginPassword}
                                errorMessage={errorMessage.loginPassword}
                                onKeyUp={handlePasswordChange}
                                value={loginInput.password}
                                onChange={handleLoginChange}
                                type="password"
                                name="password"
                                label="Password"
                                variant="bordered"
                                placeholder="Enter your password"
                                description="Remember, we don't share your password with anyone."
                                isRequired
                                isClearable
                            />
                            <Button onClick={authenticateLoginInfo} color="primary" variant="solid" className="sm:w-5/6 mx-auto">
                                Login
                            </Button>
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-b border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-4 text-sm text-gray-500">OR</span>
                                </div>
                            </div>
                            <div className="flex justify-center items-center mb-5">
                                <GoogleButton onClick={signInWithGoogle} />
                            </div>
                            <p className="text-center text-xs text-gray-500">
                                Don't have an account? <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => setRegister(true)}>Register here</span>
                            </p>
                        </CardBody>
                    </Card>
                }
            </div>
        </div>
    )
}