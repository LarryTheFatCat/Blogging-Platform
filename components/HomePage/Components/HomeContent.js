import { Card, CardHeader } from "@nextui-org/react";

export default function HomeContent() {
    return (
        <div>
            <Card className="h-full w-[118%] p-10 right-28">
                <CardHeader>
                    <h1 className="font-thin text-3xl">
                        Home
                    </h1>
                </CardHeader>
            </Card>
        </div>
    )
}