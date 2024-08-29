import LockIcon from "@/components/icons/LockIcon";
import PasswordHiddenIcon from "@/components/icons/PasswordHiddenIcon";
import PasswordVisibileIcon from "@/components/icons/PasswordVisibileIcon";
import { auth } from "@/utils/firebase";
import { Button, Input } from "@nextui-org/react";
import { updatePassword } from "firebase/auth";
import { useState } from "react";

export default function UpdatePasswordChildComponent() {
    const [errorState, setErrorState] = useState(
        {
            currentPassword: { isInvalid: false, errorMessage: "" },
            newPassword: { isInvalid: false, errorMessage: "" },
            general: { isInvalid: false, errorMessage: "" }
        }
    );
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(
        {
            currentPassword: false,
            newPassword: false,
        }
    );
    const [input, setInput] = useState(
        {
            currentPassword: "",
            newPassword: "",
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput(prevInput => (
            {
                ...prevInput,
                [name]: value,
            }
        ));
    };

    const toggleVisibility = (field) => {
        setVisible(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const setNewPassword = async () => {
        setLoading(true);
        setErrorState({
            currentPassword: { isInvalid: false, errorMessage: "" },
            newPassword: { isInvalid: false, errorMessage: "" },
            general: { isInvalid: false, errorMessage: "" }
        });

        const user = auth.currentUser;

        try {
            const credential = EmailAuthProvider.credential(
                user.email,
                input.currentPassword
            );
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, input.newPassword);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.code === 'auth/wrong-password') {
                setErrorState(prev => ({
                    ...prev,
                    currentPassword: { isInvalid: true, errorMessage: "Incorrect current password" }
                }));
            } else {
                setErrorState(prev => ({
                    ...prev,
                    general: { isInvalid: true, errorMessage: error.message }
                }));
            }
        }
    };

    return (
        <>
            <h1 className="text-lg mt-5">Password</h1>
            <p className="text-xs text-gray-500">
                Modify your current password.
            </p>
            <div className="grid grid-cols-3 pt-3 gap-5">
                <Input
                    type={visible.currentPassword ? "text" : "password"}
                    value={input.currentPassword}
                    onChange={handleChange}
                    name="currentPassword"
                    label="Current Password"
                    variant="faded"
                    placeholder="*******"
                    classNames={{
                        input: [
                            "placeholder:text-2xl",
                            "text-2xl",
                            "pt-0",
                            "pb-0",
                            "h-14",
                        ],
                        innerWrapper: "pb-0",
                    }}
                    labelPlacement="outside"
                    startContent={<LockIcon />}
                    endContent={
                        <Button
                            variant="light"
                            onClick={() => toggleVisibility('currentPassword')}
                            isIconOnly
                        >
                            {visible.currentPassword ?
                                <PasswordVisibileIcon />
                                :
                                <PasswordHiddenIcon />
                            }
                        </Button>
                    }
                    isInvalid={errorState.currentPassword.isInvalid}
                    errorMessage={errorState.currentPassword.errorMessage}
                />
                <Input
                    type={visible.newPassword ? "text" : "password"}
                    value={input.newPassword}
                    onChange={handleChange}
                    name="newPassword"
                    label="New Password"
                    variant="faded"
                    placeholder="********"
                    classNames={{
                        input: [
                            "placeholder:text-2xl",
                            "text-2xl",
                            "pt-0",
                            "pb-0",
                            "h-14",
                        ],
                        innerWrapper: "pb-0",
                    }}
                    labelPlacement="outside"
                    startContent={<LockIcon />}
                    endContent={
                        <Button
                            variant="light"
                            onClick={() => toggleVisibility('newPassword')}
                            isIconOnly
                        >
                            {visible.newPassword ?
                                <PasswordVisibileIcon />
                                :
                                <PasswordHiddenIcon />
                            }
                        </Button>
                    }
                    isInvalid={errorState.newPassword.isInvalid}
                    errorMessage={errorState.newPassword.errorMessage}
                />
                <Button
                    isLoading={loading}
                    onClick={setNewPassword}
                    className="mt-6"
                    variant="bordered"
                    color="primary"
                >
                    Update Password
                </Button>
            </div>
            {errorState.general.isInvalid && (
                <p className="text-red-500 mt-2">{errorState.general.errorMessage}</p>
            )}
        </>
    );
}