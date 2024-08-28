import { auth } from "@/utils/firebase";
import { avatar, Button, Card, CardBody, CardHeader, Divider, User } from "@nextui-org/react";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { FaUser, FaHome, FaCompass, FaList, FaBookmark, FaCog } from 'react-icons/fa';

export default function Sidebar({ onItemSelect }) {
    const [avatarURL, setAvatarURL] = useState(null);
    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
    });
    const sideBarItems = [
        { name: "Home", icon: FaHome },
        { name: "Profile", icon: FaUser },
        { name: "Explore", icon: FaCompass },
        { name: "Categories", icon: FaList },
        { name: "Favourites / Bookmarked", icon: FaBookmark },
        { name: "Settings", icon: FaCog }
    ];
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const email = user.email;
                const displayName = user.displayName;
                setUserInfo(
                    {
                        email: email,
                        username: displayName,
                    }
                );
                setAvatarURL(user.photoURL);
            } else {
                setUserInfo(
                    {
                        email: "N/A - Please retry again...",
                        username: "N/A - Please retry again...",
                    }
                );
                setAvatarURL(null);
            }
        });

        return () => unsubscribe();
    }, []);
    return (
        <div className="flex items-center h-screen">
            <Card className="w-[500px] p-10 align-middle">
                <CardHeader className="grid grid-cols-1">
                    <div >
                        <h1 className="text-xl text-gray-400 font-thin">
                            Welcome {userInfo.username}
                        </h1>
                    </div>
                    <User className="justify-start pt-5 pl-3 pb-3" avatarProps={{ src: avatarURL }} name={userInfo.username} description={userInfo.email} />
                </CardHeader>
                <Divider />
                <CardBody className="pt-3 gap-y-5">
                    {sideBarItems.map((item) => (
                        <Button
                            key={item.name}
                            variant="light"
                            className="justify-start"
                            onClick={() => onItemSelect(item.name)}
                        >
                            <item.icon className="mr-2" />
                            {item.name}
                        </Button>
                    ))}
                </CardBody>
            </Card>
        </div>
    )
}