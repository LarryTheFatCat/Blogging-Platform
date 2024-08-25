"use client"
import MobileNavBar from "@/components/MainPageComponents/Navigation/MobileNavBar";
import NavBar from "@/components/MainPageComponents/Navigation/Navbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { storage } from "@/utils/Firebase";
import { Avatar, Button, Card, CardBody, CardHeader, Divider, Input } from "@nextui-org/react";
import { listAll, uploadBytes, uploadString } from "firebase/storage";
import { useState, useEffect } from "react";
import { ref } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { useParams } from "next/navigation";


export default function Settings() {
    // if > 640px, show desktop navbar, else show mobile navbar
    // returns boolean determining if desktop or mobile
    const isDesktop = useMediaQuery("(min-width: 640px)");
    const [avatar, setAvatar] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const imageListRef = ref(storage, "images/");
    const params = useParams();
    const [uid, setUid] = useState("");

    useEffect(() => {
        if (params && params.uid) {
            const uid = params.uid;
            setUid(uid);
        }
    }, [params]);


    useEffect(() => {
        const fetchImages = async () => {
            try {
                await listAll(imageListRef).then((response) => {
                    response.items.forEach((item) => {
                        getDownloadURL(item).then((url) => {
                            setAvatar(url);
                        })
                    })
                })
            } catch (error) {
                console.error("Error listing images:", error);
            }
        };

        fetchImages();
    }, []);

    function uploadImage() {
        if (imageUpload === null) return;
        const imageRef = ref(storage, `${uid}/${imageUpload.name}`);
        uploadBytes(imageRef, imageUpload).then(() => {
            alert("image uploaded successfully");
        })
    }
    return (
        <>
            {isDesktop ? <NavBar /> : <MobileNavBar />}
            <div className="flex justify-center items-start gap-4 p-4">
                <Card className="w-96">
                    <CardHeader>
                        <h1 className="">

                        </h1>
                    </CardHeader>
                </Card>
                <Card className="w-[40rem] pt-10 px-10 pb-10">
                    <h1 className="text-3xl pb-10">
                        Profile Settings
                    </h1>
                    <Divider />
                    <CardBody className="pt-10">
                        <div className="pb-4">
                            <h2 className="text-2xl">
                                Avatar
                            </h2>
                            <p className="text-xs text-gray-500">
                                Anything inapropriate will be removed with the possibility of being terminated from this platform.
                            </p>
                            <div className="flex justify-start gap-5 pt-5">
                                <Avatar radius="md" src={avatar} />
                                <Input type="file" onChange={(e) => setImageUpload(e.target.files[0])} className="w-52" />
                                <Button variant="solid" color="primary" onClick={uploadImage}>Upload</Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}