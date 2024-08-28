import { useState, useEffect } from "react";
import { auth, db, storage } from "@/utils/firebase";
import { Avatar, Button, ButtonGroup, Card, CardBody, CardHeader, Divider, Input, Tooltip } from "@nextui-org/react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function SettingsContent() {
    const [photoURL, setPhotoURL] = useState(null);
    const [errorState, setErrorState] = useState(
        {
            bool: false,
            reason: "First name and last name must be at least 3 characters long"
        }
    )
    const [imageUpload, setImageUpload] = useState(null);
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

    const fileUploadDialog = async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker(
                {
                    types: [
                        {
                            description: 'Images',
                            accept: {
                                'image/*': ['.png'],
                            }
                        },
                    ],
                    multiple: false
                }
            );
            const file = await fileHandle.getFile();
            handleFile(file);
        } catch (e) {
            console.log(e);
        }
    }

    const handleFile = (file) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                const newFileName = `${uid}`;
                const renamedFile = new File([file], newFileName, { type: file.type });
                setImageUpload(renamedFile);
                uploadImage(renamedFile);
            }
        })
        return () => unsubscribe();
    }

    const uploadImage = (file) => {
        if (file === null) return;
        const user = auth.currentUser;
        if (!user) {
            console.error("No user logged in");
            return;
        }

        const imageRef = ref(storage, `${file.name}`);
        uploadBytes(imageRef, file)
            .then(() => getDownloadURL(imageRef))
            .then((url) => {
                return updateProfile(user, { photoURL: url });
            })
            .catch((error) => {
                console.error(error);
            });
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setPhotoURL(user.photoURL);
            }
        });
        return () => unsubscribe();
    }, []);

    const deleteProfilePicture = () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            const deleteImageRef = ref(storage, `${user.uid}`);
            deleteObject(deleteImageRef).then(() => {
                alert("file deleted successfully");
                setPhotoURL("");
            }).catch((error) => {
                alert(error);
            })
        })
        return () => unsubscribe();
    }

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
                        <div className="flex">
                            <Avatar src={photoURL} className="w-24 h-24" />
                            <div className="grid grid-cols-1 pl-2 pt-2">
                                <p className="pt-3 font-bold ">
                                    Profile Picture
                                </p>
                                <p className="pb-10 font-thin text-gray-700">
                                    PNG, under 15MB
                                </p>
                            </div>
                            <Button
                                variant="faded"
                                color="primary"
                                size="md"
                                onClick={fileUploadDialog}
                                className="left-56 mt-5"
                            >
                                Upload new picture
                            </Button>
                            <Button
                                variant="faded"
                                size="md"
                                onClick={deleteProfilePicture}
                                className="left-60 mt-5 border-red-500 text-red-500 hover:border-red-950 hover:text-red-950"
                            >
                                Delete
                            </Button>
                        </div>
                        <div className="pl-3">
                            <h3 className="text-lg">
                                Full Name
                            </h3>
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
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}