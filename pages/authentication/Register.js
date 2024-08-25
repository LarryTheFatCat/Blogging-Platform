import { MailIcon } from "@/components/Icons/MailIcon";
import Hidden from "@/components/Icons/PasswordHiddenIcon";
import PasswordIcon from "@/components/Icons/PasswordIcon";
import PasswordVisible from "@/components/Icons/PasswordVisibleIcon";
import UsernameIcon from "@/components/Icons/UsernameIcon";
import { doCreateUserWithEmailAndPassword } from "@/utils/ConfigFunctions";
import { db } from "@/utils/Firebase";
import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";

export default function Register(props) {
    const router = useRouter();
    const [errorState, setErrorState] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    function toggleVisibility() {
        setHidden(!hidden);
    }

    function handleChange(e) {
        let { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    async function handleSubmit() {
        if (!registered && !loading) {
            try {
                setLoading(true);
                setRegistered(true);
                const userCredential = await doCreateUserWithEmailAndPassword(input.email, input.password);
                const uid = userCredential.user.uid;
                await setDoc(doc(db, 'users', uid), {
                    uid: uid,
                    username: input.username,
                    email: input.email,
                    profilePicture: "",
                    bio: "",
                    followers: [],
                    following: [],
                    posts: [],
                    savedPosts: [],
                    likedPosts: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isAdmin: false,
                    isVerified: false,
                    isBanned: false,
                    isDeleted: false,
                    isActive: true,
                    gender: "",
                    dob: "",
                    phone: "",
                    geoLocation: "",
                    website: "",
                    socialMedia: "",
                    interests: [],
                    skills: [],
                    education: [],
                    work: [],
                });
                router.push("/");
            } catch (e) {
                setErrorState(true);
                setRegistered(false); // Reset if there's an error
            } finally {
                setLoading(false);
            }
        }
    }


    return (
        <div className="flex justify-center items-center h-screen" {...props}>
            <Card className="w-96 p-5">
                <h1 className="text-2xl font-bold underline underline-offset-2 text-center">
                    Register
                </h1>
                <Divider className="my-4" />
                <CardBody>
                    <Input
                        isInvalid={errorState}
                        errorMessage="Incorrect Username / Already in use"
                        color={errorState ? "danger" : "default"}
                        label="Username"
                        type="text"
                        value={input.username}
                        name="username"
                        onChange={handleChange}
                        labelPlacement="outside"
                        placeholder="xX_cool_username_Xx"
                        variant="faded"
                        className="mb-4"
                        startContent={<UsernameIcon className="text-2xl text-neutral-500" />}
                    />

                    <Input
                        isInvalid={errorState}
                        errorMessage="Incorrect Username / Already in use"
                        color={errorState ? "danger" : "default"}
                        label="Email"
                        type="email"
                        value={input.email}
                        name="email"
                        onChange={handleChange}
                        labelPlacement="outside"
                        placeholder="some.cool@email.com"
                        variant="faded"
                        className="mb-4"
                        startContent={<MailIcon className="text-2xl text-neutral-500" />}
                    />
                    <Input
                        isInvalid={errorState}
                        errorMessage="Incorrect Username / Already in use"
                        color={errorState ? "danger" : "default"}
                        label="Password"
                        type={hidden ? "text" : "password"}
                        value={input.password}
                        name="password"
                        onChange={handleChange}
                        labelPlacement="outside"
                        placeholder="********"
                        variant="faded"
                        startContent={<PasswordIcon className="text-2xl text-neutral-500" />}
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                {hidden ? (
                                    <Hidden className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <PasswordVisible className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                    />
                    <Button onClick={handleSubmit} className="w-2 mx-auto mt-5" variant="solid" color="primary" isLoading={loading}>Login</Button>
                    <p className="text-center text-xs text-gray-500 mt-2">
                        Have an account? <Link className="hover:underline" href="/authentication/Login">Login here</Link>
                    </p>
                </CardBody>
            </Card>
        </div>
    )
}