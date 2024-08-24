import { Card, CardBody, CardHeader } from "@nextui-org/react";

export default function Activity() {
    return (
        <Card>
            <CardHeader className="grid grid-cols-2">
                <h1 className="grid col-span-1 font-bold text-xl hover:underline underline-offset-2">
                    Activity
                </h1>
                <p className="text-gray-500 text-xs text-end cursor-pointer hover:underline">
                    See all
                </p>
            </CardHeader>
            <CardBody>
                {/*@TODO: Map out mentions, stories, and new notifications through here */}
                <div className="grid grid-rows-2">
                    <div className="grid row-span-1">
                        <h1 className="font-bold text-lg">
                            Stories about you
                        </h1>
                        <div className="grid row-span-1">
                            <h3 className="text-gray-500 text-md font-medium text-center">
                                Sorry, no stories about you :(
                            </h3>
                        </div>
                    </div>
                    <div className="grid row-span-1">
                        <h1 className="font-bold text-lg">
                            New
                        </h1>
                        <div className="text-center text-gray-500 text-md font-medium">
                            Sorry nothing new here :(
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}