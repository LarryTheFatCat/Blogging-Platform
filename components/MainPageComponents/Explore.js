import { Badge, Card, CardBody, CardHeader, Chip } from "@nextui-org/react";

export default function Explore() {
    return (
        <Card>
            <CardHeader className="grid grid-cols-2">
                <h1 className="grid col-span-1 font-bold text-xl hover:underline underline-offset-2">
                    Explore
                </h1>
                <p className="text-gray-500 text-xs text-end cursor-pointer hover:underline">
                    See all
                </p>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-3 mx-auto gap-4">
                    <div className="grid col-span-1">
                        <Chip>
                            <p className="font-semibold text-sm cursor-pointer hover:underline">
                                Product
                            </p>
                        </Chip>
                    </div>
                    <div className="grid col-span-1">
                        <Chip>
                            <p className="font-semibold text-sm cursor-pointer hover:underline">
                                Website
                            </p>
                        </Chip>
                    </div>
                    <div className="grid col-span-1">
                        <Chip>
                            <p className="font-semibold text-sm cursor-pointer hover:underline">
                                Designing
                            </p>
                        </Chip>
                    </div>
                </div>
                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                    <div>
                    </div>
                </div>
            </CardBody>
        </Card >
    )
}