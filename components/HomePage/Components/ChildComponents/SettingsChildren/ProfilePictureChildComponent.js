import { useState, useEffect } from "react";
import { auth, storage } from "@/utils/firebase";
import { Avatar, Button } from "@nextui-org/react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { updateProfile } from "firebase/auth";

export default function ProfilePictureChildComponent() {
    const [loading, setLoading] = useState(false);
    const [photoURL, setPhotoURL] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setPhotoURL(user.photoURL);
            }
        });
        return () => unsubscribe();
    }, []);

    const fileUploadDialog = async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'Images',
                        accept: {
                            'image/*': ['.png'],
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
        setLoading(true);
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
            .then(() => {
                setPhotoURL(user.photoURL);
            }).then(() => {
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const deleteProfilePicture = () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            const deleteImageRef = ref(storage, `${user.uid}`);
            deleteObject(deleteImageRef).then(() => {
                alert("file deleted successfully");
                setPhotoURL("");
                updateProfile(user, { photoURL: "" });
            }).catch((error) => {
                alert(error);
            })
        })
        return () => unsubscribe();
    }

    return (
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
                isLoading={loading}
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
    )
}