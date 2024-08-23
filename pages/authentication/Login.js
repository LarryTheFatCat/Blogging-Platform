import { MailIcon } from "@/components/Icons/MailIcon";
import PasswordIcon from "@/components/Icons/PasswordIcon";
import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import Hidden from "@/components/Icons/PasswordHiddenIcon";
import PasswordVisible from "@/components/Icons/PasswordVisibleIcon";

export default function Login(props) {
    const [hidden, setHidden] = useState(true);
    const toggleVisibility = () => setHidden(!hidden);
    return (
        <div className="flex justify-center items-center h-screen" {...props}>
            <Card className="w-96 p-5">
                <h1 className="text-2xl font-bold underline underline-offset-2 text-center">
                    Login
                </h1>
                <Divider className="my-4" />
                <CardBody>
                    <Input
                        label="Email"
                        type="email"
                        labelPlacement="outside"
                        placeholder="some.cool@email.com"
                        variant="faded"
                        className="mb-4"
                        startContent={<MailIcon className="text-2xl text-neutral-500" />}
                    />
                    <Input
                        label="Password"
                        type={hidden ? "password" : "text"}
                        labelPlacement="outside"
                        placeholder="CoolPassword123!"
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
                    <Link className="mx-auto mt-5" href="/"> {/**@TODO: Implement redirect based on uid generated in database */}
                        <Button className="w-2" variant="solid" color="primary">Login</Button>
                    </Link>
                    <p className="text-center text-xs text-gray-500 mt-2">
                        No account? <Link className="hover:underline" href="/authentication/Register">Register here.</Link>
                    </p>
                </CardBody>
            </Card>
        </div>
    )
}