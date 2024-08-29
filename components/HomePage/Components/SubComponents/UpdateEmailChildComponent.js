import { Button, Input } from "@nextui-org/react";
import { MailIcon } from "@/components/icons/MailIcon";
import { useState, useEffect } from "react";
import { auth, db } from "@/utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import PlusIcon from "@/components/icons/PlusIcon";
import DeleteIcon from "@/components/icons/DeleteIcon"; // Add this import

export default function UpdateEmailChildComponent() {
    const [loading, setLoading] = useState(false);
    const [primaryEmail, setPrimaryEmail] = useState("");
    const [additionalEmail, setAdditionalEmail] = useState("");
    const [showAdditionalEmail, setShowAdditionalEmail] = useState(false);

    useEffect(() => {
        const fetchEmails = async () => {
            const user = auth.currentUser;
            if (user) {
                const uid = user.uid;
                const documentReference = doc(db, `users/${uid}`);
                const documentSnapshot = await getDoc(documentReference);
                if (documentSnapshot.exists()) {
                    const userData = documentSnapshot.data();
                    setPrimaryEmail(userData.email || "");
                    if (userData.additionalEmail1) {
                        setAdditionalEmail(userData.additionalEmail1);
                        setShowAdditionalEmail(true);
                    }
                }
            }
        };
        fetchEmails();
    }, []);

    const deleteAdditionalEmail = async () => {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
            const uid = user.uid;
            const documentReference = doc(db, "users", uid);
            await updateDoc(documentReference, {
                additionalEmail1: null
            });
            setAdditionalEmail("");
            setShowAdditionalEmail(false);
            setLoading(false);
        }
    };

    const saveEmails = async () => {
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (user) {
                const uid = user.uid;
                const documentReference = doc(db, "users", uid);
                const updateData = {
                    email: primaryEmail,
                    additionalEmail1: additionalEmail || null
                };
                await updateDoc(documentReference, updateData);
                // Optionally, you can add a success message here
            }
        } catch (error) {
            console.error("Error saving emails:", error);
            // Optionally, you can add an error message here
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1 className="text-lg mt-5">Update Email</h1>
            <div className="grid grid-cols-3 mt-5 gap-5">
                <Input
                    type="email"
                    label="Primary Email"
                    variant="faded"
                    value={primaryEmail}
                    onChange={(e) => setPrimaryEmail(e.target.value)}
                    labelPlacement="outside"
                    endContent={<MailIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />}
                />
                {showAdditionalEmail ? (
                    <div className="flex items-center">
                        <Input
                            type="email"
                            label="Additional Email"
                            variant="faded"
                            value={additionalEmail}
                            onChange={(e) => setAdditionalEmail(e.target.value)}
                            labelPlacement="outside"
                            endContent={<MailIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />}
                        />
                        <Button
                            color="danger"
                            variant="light"
                            isIconOnly
                            className="ml-2"
                            onPress={deleteAdditionalEmail}
                        >
                            <DeleteIcon />
                        </Button>
                    </div>
                ) : (
                    <Button
                        color="primary"
                        variant="bordered"
                        className="mt-6"
                        onPress={() => setShowAdditionalEmail(true)}
                    >
                        <PlusIcon />
                        Add Email
                    </Button>
                )}
                <Button
                    color="primary"
                    className="mt-6"
                    variant="solid"
                    onPress={saveEmails}
                    isLoading={loading}
                >
                    {loading ? "Saving..." : "Save"}
                </Button>
            </div>
        </div>
    )
}