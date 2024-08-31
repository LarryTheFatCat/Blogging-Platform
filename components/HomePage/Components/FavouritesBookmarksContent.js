import { Card, CardHeader } from "@nextui-org/react"

export default function FavouritesBookmarksContent() {
    return (
        <div>
            <Card className="h-full w-[118%] p-10 right-28">
                <CardHeader>
                    <h1 className="font-thin text-3xl">
                        Favourites / Bookmarked
                    </h1>
                </CardHeader>
            </Card>
        </div>
    )
}