import { MailIcon } from "@/components/Icons/MailIcon";
import PasswordIcon from "@/components/Icons/PasswordIcon";
import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import Hidden from "@/components/Icons/PasswordHiddenIcon";
import PasswordVisible from "@/components/Icons/PasswordVisibleIcon";
import { doSignInWithEmailAndPassword } from "@/utils/ConfigFunctions";
import { useRouter } from "next/router";
import { auth } from "@/utils/ConfigFunctions";

export default function Login(props) {
    const router = useRouter();
    const [hidden, setHidden] = useState(true);
    const [errorState, setErrorState] = useState(false);
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(false);
    const toggleVisibility = () => setHidden(!hidden);

    function handleChange(e) {
        let { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    async function handleLogin() {
        if (!registered && !loading) {
            try {
                const userId = await doSignInWithEmailAndPassword(input.email, input.password);
                setLoading(true);
                setRegistered(true);
                router.push(`/${userId.user.uid}/home`);
            } catch (errorMessage) {
                setErrorState(true);
            } finally {
                setLoading(false);
            }
            // console.log(userCredentials.user.uid);
        }
    }
    return (
        <div className="flex justify-center items-center h-screen" {...props}>
            <Card className="w-96 p-5">
                <h1 className="text-2xl font-bold underline underline-offset-2 text-center">
                    Login
                </h1>
                <Divider className="my-4" />
                <CardBody>
                    <Input
                        isInvalid={errorState}
                        label="Email"
                        type="email"
                        value={input.email}
                        name="email"
                        color={errorState ? "danger" : "default"}
                        onChange={handleChange}
                        labelPlacement="outside"
                        errorMessage="Invalid email / password"
                        placeholder="some.cool@email.com"
                        className="mb-4"
                        startContent={<MailIcon className="text-2xl text-neutral-500" />}
                    />
                    <Input
                        isInvalid={errorState}
                        label="Password"
                        type={hidden ? "password" : "text"}
                        color={errorState ? "danger" : "default"}
                        errorMessage="Invalid email / password"
                        value={input.password}
                        name="password"
                        onChange={handleChange}
                        labelPlacement="outside"
                        placeholder="CoolPassword123!"
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
                    <Button className="w-2 mx-auto mt-5" variant="solid" color="primary" onClick={handleLogin} isLoading={loading}>Login</Button>
                    <p className="text-center text-xs text-gray-500 mt-2">
                        No account? <Link className="hover:underline" href="/authentication/Register">Register here.</Link>
                    </p>
                </CardBody>
            </Card>
        </div>
    )
}