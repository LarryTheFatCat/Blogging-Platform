import { useState, useEffect } from "react";
import { auth, db } from "@/utils/firebase";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Input,
    Tooltip
} from "@nextui-org/react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { MailIcon } from "@/components/icons/MailIcon";
import ProfilePictureChildComponent from "./SubComponents/ProfilePictureChildComponent";
import FirstAndLastNameChildComponent from "./SubComponents/FirstAndLastNameChildComponent";

export default function SettingsContent() {
    // State variables
    const [email, setEmail] = useState("");
    // ... removed state variables for name updates ...

    // ... removed useEffect for fetching user name ...

    // ... removed nameInfoUpdate function ...

    // ... removed updateNameState function ...

    return (
        <div>
            <Card className="h-full w-[118%] p-10 right-28">
                <CardHeader>
                    <div className="grid grid-cols-1">
                        <h1 className="font-thin text-3xl">
                            Settings
                        </h1>
                        <h3 className="font-bold text-lg pt-5 pl-3">
                            Account
                        </h3>
                        <p className="text-md font-thin underline pl-5">
                            Real-time information and activies of your profile.
                        </p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="pl-3">
                        <ProfilePictureChildComponent />
                        <FirstAndLastNameChildComponent />
                        <Divider className="mt-5" />
                        <div>
                            <h3 className="text-lg mt-5">
                                Contact Email
                            </h3>
                            <p className="text-xs text-gray-500">
                                Manage your accounts email addresses for security and convience!
                            </p>
                            <div className="grid grid-cols-2 mt-5">
                                <Input
                                    isInvalid={false}
                                    errorMessage="Please enter a valid email!"
                                    type="email"
                                    label="Email"
                                    placeholder={email}
                                    labelPlacement="outside"
                                    endContent={<MailIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />}
                                />
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}