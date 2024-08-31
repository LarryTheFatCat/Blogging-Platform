import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import ProfileHeaderChildrenComponent from "./ChildComponents/ProfileChildren/ProfileHeaderChildrenComponent";
import ProfileBodyChildComponent from "./ChildComponents/ProfileChildren/ProfileBodyChildComponent";

export default function ProfileContent() {
    return (
        <div>
            <Card className="h-full w-[118%] p-10 right-28">
                <CardHeader>
                    <ProfileHeaderChildrenComponent />
                </CardHeader>
                <Divider />
                <CardBody>
                    <ProfileBodyChildComponent />
                </CardBody>
            </Card>
        </div>
    )
}