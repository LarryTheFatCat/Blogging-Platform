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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { MailIcon } from "@/components/icons/MailIcon";
import ProfilePictureChildComponent from "./SubComponents/ProfilePictureChildComponent";

export default function SettingsContent() {
    // State variables
    const [email, setEmail] = useState("");
    const [errorState, setErrorState] = useState(
        {
            bool: false,
            reason: "First name and last name must be at least 3 characters long"
        }
    )
    const [nameInfo, setNameInfo] = useState(
        {
            firstName: "",
            lastName: "",
        }
    );
    const [updateNameInfo, setUpdateNameInfo] = useState(
        {
            updatedFirstName: "",
            updatedLastName: "",
        }
    );
    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const UPDATE_COOLDOWN = 60000; // 1 minute cooldown

    // Name management
    useEffect(() => {
        const fetchUserName = async () => {
            const user = auth.currentUser;
            if (user) {
                const uid = user.uid;
                const documentReference = doc(db, `users/${uid}`);
                const documentSnapshot = await getDoc(documentReference);

                if (documentSnapshot.exists()) {
                    let name = documentSnapshot.data().username.split(' ');
                    setNameInfo({
                        firstName: name[0],
                        lastName: name[1],
                    });
                }
            }
        };

        fetchUserName();
    }, []); // Empty dependency array

    const updateButtonState = () => {
        if (updateNameInfo.updatedFirstName.length <= 3) {

        }
    }
    const nameInfoUpdate = async () => {
        const now = Date.now();
        if (now - lastUpdateTime < UPDATE_COOLDOWN) {
            alert(`Please wait ${Math.ceil((UPDATE_COOLDOWN - (now - lastUpdateTime)) / 1000)} seconds before updating again.`);
            return;
        }

        if (updateNameInfo.updatedFirstName.length < 3 || updateNameInfo.updatedLastName.length < 3) {
            setErrorState({
                bool: true,
                reason: "First name and last name must be at least 3 characters long"
            });
        } else {
            setErrorState({
                bool: false,
                reason: ""
            });
            const user = auth.currentUser;
            if (user) {
                try {
                    const uid = user.uid;
                    const updateDocumentReference = doc(db, `users/${uid}`);
                    const fullName = `${updateNameInfo.updatedFirstName} ${updateNameInfo.updatedLastName}`;
                    await updateDoc(updateDocumentReference, {
                        username: fullName
                    });
                    setNameInfo({
                        firstName: updateNameInfo.updatedFirstName,
                        lastName: updateNameInfo.updatedLastName
                    });
                    setUpdateNameInfo({
                        updatedFirstName: "",
                        updatedLastName: ""
                    });
                    setLastUpdateTime(now);
                    alert("Name updated successfully!");
                } catch (error) {
                    console.error("Error updating name:", error);
                    if (error.code === "resource-exhausted") {
                        alert("Unable to update name at this time. Please try again later.");
                    } else {
                        alert("An error occurred while updating your name. Please try again.");
                    }
                }
            }
        }
    }
    const updateNameState = (event) => {
        const { name, value } = event.target;
        setUpdateNameInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));

        const { updatedFirstName, updatedLastName } = updateNameInfo;
        const isValid = (name === 'updatedFirstName' ? value : updatedLastName).length >= 3 &&
            (name === 'updatedLastName' ? value : updatedLastName).length >= 3;

        setErrorState({
            bool: !isValid,
            reason: isValid ? "" : "First name and last name must be at least 3 characters long"
        });
    }

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
                        <div className="grid grid-cols-3 gap-5 mt-5">
                            <Input
                                isInvalid={errorState.bool}
                                errorMessage={errorState.reason}
                                label="First Name"
                                labelPlacement="outside"
                                placeholder={nameInfo.firstName}
                                variant="faded"
                                radius="sm"
                                onKeyUp={updateButtonState}
                                value={updateNameInfo.updatedFirstName}
                                onChange={updateNameState}
                                name="updatedFirstName"
                            />
                            <Input
                                isInvalid={errorState.bool}
                                errorMessage={errorState.reason}
                                label="Last Name"
                                labelPlacement="outside"
                                placeholder={nameInfo.lastName}
                                variant="faded"
                                radius="sm"
                                onKeyUp={updateButtonState}
                                value={updateNameInfo.updatedLastName}
                                onChange={updateNameState}
                                name="updatedLastName"
                            />
                            <Tooltip showArrow={true} content="Remember, we don't share your info with anyone 😊" color="warning" className="text-gray-500">
                                <Button
                                    onClick={nameInfoUpdate}
                                    className="mt-6"
                                    variant="faded"
                                    color="primary"
                                    radius="sm"
                                    isDisabled={errorState.bool}
                                >
                                    Update Name
                                </Button>
                            </Tooltip>
                        </div>
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
                                    isInvalid={errorState.bool}
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