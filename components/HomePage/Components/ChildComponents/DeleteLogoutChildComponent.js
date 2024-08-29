import { auth, db, storage } from "@/utils/firebase";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { deleteUser } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/router";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { doSignOut } from "@/utils/ConfigFunctions";

export default function DeleteLogoutChildComponent() {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(false);

    const deleteAccount = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("No user is currently signed in.");
            return;
        }
        const uid = user.uid;
        const deleteReference = ref(storage, `${uid}`);
        setLoading(true);
        try {
            await deleteDoc(doc(db, "users", uid));
            await deleteUser(user);
            await deleteObject(deleteReference);
            setLoading(false);
            router.push("/");
        } catch (e) {
            setLoading(false);
            alert(e.message);
        }
    }

    return (
        <>
            <h1 className="text-lg mt-5">Account info</h1>
            <p className="text-xs text-gray-500">
                Delete / Logout of your account.
            </p>
            <div className="mt-5">
                <Button onPress={onOpen} variant="bordered" color="danger" className="w-32">
                    Delete Account
                </Button>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    <h1 className="text-2xl font-bold text-danger">
                                        Woah! Hold it right there!
                                    </h1>
                                </ModalHeader>
                                <ModalBody>
                                    <p>Are you sure you want to delete your account?
                                        This action cannot be undone.
                                        <br />
                                        <br />
                                        Remember, everything you own on this account will be not-recoverable...
                                        Make sure to backup everything beforehand.
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Cancel
                                    </Button>
                                    <Button isLoading={loading} color="danger" onClick={deleteAccount}>
                                        Delete Account
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <Button
                    isLoading={loading}
                    onClick={
                        () => {
                            doSignOut()
                            router.push("/")
                        }
                    }
                    variant="bordered"
                    color="warning"
                    className="w-32 ml-5"
                >
                    Sign Out
                </Button>
            </div>
        </>
    )
}