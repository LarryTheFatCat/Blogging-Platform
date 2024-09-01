import { useState, useEffect } from "react";
import { auth, db } from "@/utils/firebase";
import {
    Button,
    Input,
    Tooltip
} from "@nextui-org/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function FirstAndLastNameChildComponent() {
    const [loading, setLoading] = useState(false);
    const [errorState, setErrorState] = useState({
        bool: false,
        reason: "First name and last name must be at least 3 characters long"
    });
    const [nameInfo, setNameInfo] = useState({
        firstName: "",
        lastName: "",
    });
    const [updateNameInfo, setUpdateNameInfo] = useState({
        updatedFirstName: "",
        updatedLastName: "",
    });
    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const UPDATE_COOLDOWN = 60000;

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
    }, []);

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
            setLoading(true);
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
                    setLoading(false);
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
        const isValid = (name === 'updatedFirstName' ? value : updatedFirstName).length >= 3 &&
            (name === 'updatedLastName' ? value : updatedLastName).length >= 3;

        setErrorState({
            bool: !isValid,
            reason: isValid ? "" : "First name and last name must be at least 3 characters long"
        });
    }

    return (
        <div className="grid grid-cols-3 gap-5 mt-5">
            <Input
                isInvalid={errorState.bool}
                errorMessage={errorState.reason}
                label="First Name"
                labelPlacement="outside"
                placeholder={nameInfo.firstName}
                variant="faded"
                radius="sm"
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
                value={updateNameInfo.updatedLastName}
                onChange={updateNameState}
                name="updatedLastName"
            />
            <Tooltip showArrow={true} content="Remember, we don't share your info with anyone 😊" color="warning" className="text-gray-500">
                <Button
                    onClick={nameInfoUpdate}
                    className="mt-6"
                    variant="bordered"
                    color="primary"
                    radius="sm"
                    isDisabled={errorState.bool}
                    isLoading={loading}
                >
                    Update Name
                </Button>
            </Tooltip>
        </div>
    );
}