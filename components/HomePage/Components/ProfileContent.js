import { Card, CardHeader } from "@nextui-org/react";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react"

export default function ProfileContent() {
    const [name, setName] = useState("")
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const displayName = user.displayName || "";
                setName(displayName);
            }
        });

        return () => unsubscribe();
    }, []);
    return (
        <div>
            <Card className="h-full w-[118%] p-10 right-28">
                <CardHeader>
                    <h1 className="font-thin text-3xl">
                        Profile Of: {name}
                    </h1>
                </CardHeader>
            </Card>
        </div>
    )
}