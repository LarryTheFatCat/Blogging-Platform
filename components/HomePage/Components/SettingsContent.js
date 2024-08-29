import {
    Card,
    CardBody,
    CardHeader,
    Divider,
} from "@nextui-org/react";
import ProfilePictureChildComponent from "./ChildComponents/ProfilePictureChildComponent";
import FirstAndLastNameChildComponent from "./ChildComponents/FirstAndLastNameChildComponent";
import UpdateEmailChildComponent from "./ChildComponents/UpdateEmailChildComponent";
import UpdatePasswordChildComponent from "./ChildComponents/UpdatePasswordChildComponent";
import DeleteLogoutChildComponent from "./ChildComponents/DeleteLogoutChildComponent";
import ThemeSwitcher from "./ChildComponents/ThemeSwitcher";

export default function SettingsContent() {

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
                        <UpdateEmailChildComponent />
                        <Divider className="mt-5" />
                        <UpdatePasswordChildComponent />
                        <Divider className="mt-5" />
                        <ThemeSwitcher />
                        <Divider className="mt-5" />
                        <DeleteLogoutChildComponent />
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}