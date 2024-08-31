import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import HomeBodyContentChildren from "./ChildComponents/HomeChildren/HomeBodyContentChildren";

export default function HomeContent() {
    return (
        <div>
            <Card className="h-full w-[118%] p-10 right-28">
                <CardHeader>
                    <div>
                        <h1 className="font-thin text-3xl">
                            Home
                        </h1>
                        <h3 className="font-thin text-lg">
                            Here you'll see the posts from everyone!
                        </h3>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <HomeBodyContentChildren />
                </CardBody>
            </Card>
        </div>
    )
}