import { Card, CardHeader } from "@nextui-org/react";
import ProfileHeaderChildrenComponent from "./ChildComponents/ProfileChildren/ProfileHeaderChildrenComponent";

export default function ProfileContent() {
    return (
        <div>
            <Card className="h-full w-[118%] p-10 right-28">
                <CardHeader>
                    <ProfileHeaderChildrenComponent />
                </CardHeader>
            </Card>
        </div>
    )
}