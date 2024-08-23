import { MailIcon } from "@/components/Icons/MailIcon";
import Hidden from "@/components/Icons/PasswordHiddenIcon";
import PasswordIcon from "@/components/Icons/PasswordIcon";
import PasswordVisible from "@/components/Icons/PasswordVisibleIcon";
import UsernameIcon from "@/components/Icons/UsernameIcon";
import { doCreateUserWithEmailAndPassword } from "@/utils/ConfigFunctions";
import { db } from "@/utils/Firebase";
import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import { addDoc, collection } from "firebase/firestore";
import Link from "next/link";
import { useState } from "react";

export default function Register(props) {
    const [hidden, setHidden] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    function toggleVisibility() {
        setHidden(!hidden);
    }

    function handleChange(e) {
        let { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    async function handleSubmit() {
        if (!registered) {
            try {
                setRegistered(true);
                // Create user with Firebase Authentication
                const userCredential = await doCreateUserWithEmailAndPassword(input.email, input.password);
                
                // Add user to Firestore, using the UID from Authentication
                await addDoc(collection(db, 'users'), {
                    uid: userCredential.user.uid,
                    username: input.username,
                    email: input.email,
                    // Don't store the password in Firestore
                });
            } catch (e) {
                console.error("Error during registration:", e);
                setRegistered(false); // Reset if there's an error
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
                        label="Password"
                        type={hidden ? "password" : "text"}
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
                    <Button onClick={handleSubmit} className="w-2 mx-auto mt-5" variant="solid" color="primary">Login</Button>
                    <p className="text-center text-xs text-gray-500 mt-2">
                        Have an account? <Link className="hover:underline" href="/authentication/Login">Login here</Link>
                    </p>
                </CardBody>
            </Card>
        </div>
    )
}