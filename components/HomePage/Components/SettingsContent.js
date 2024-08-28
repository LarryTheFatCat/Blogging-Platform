import { useState } from "react";
import { auth, storage } from "@/utils/firebase";
import { Avatar, Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

export default function SettingsContent() {
    const [imageUpload, setImageUpload] = useState(null);

    const fileUploadDialog = async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'Images',
                        accept: {
                            'image/*': ['.png', '.jpg', '.jpeg']
                        }
                    },
                ],
                multiple: false
            });
            const file = await fileHandle.getFile();
            handleFile(file);
        } catch (e) {
            console.log(e);
        }
    }

    const handleFile = (file) => {
        const newFileName = `profile_${Date.now()}_${file.name}`;
        const renamedFile = new File([file], newFileName, { type: file.type });
        setImageUpload(renamedFile);
        uploadImage(renamedFile); // Pass the file directly to uploadImage
    }

    const uploadImage = (file) => {
        if (!file) return;
        
        const user = auth.currentUser;
        if (!user) {
            console.error("No user logged in");
            return;
        }

        const imageRef = ref(storage, `${user.uid}/${file.name}`);
        uploadBytes(imageRef, file)
            .then(() => getDownloadURL(imageRef))
            .then((url) => {
                return updateProfile(user, { photoURL: url });
            })
            .then(() => {
                console.log("Profile picture updated successfully");
                // You might want to update the UI or state here
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
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
                            <Avatar className="w-24 h-24" />
                            <div className="grid grid-cols-1 pl-2 pt-2">
                                <p className="pt-3 font-bold ">
                                    Profile Picture
                                </p>
                                <p className="pb-10 font-thin text-gray-700">
                                    PNG, under 15MB
                                </p>
                            </div>
                            <Button size="md" onClick={fileUploadDialog} className="left-56 mt-5">
                                Upload new picture
                            </Button>
                            <Button variant="bordered" size="md" onClick={fileUploadDialog} className="left-60 mt-5 border-red-500 text-red-500 hover:border-red-950 hover:text-red-950">
                                Delete
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}