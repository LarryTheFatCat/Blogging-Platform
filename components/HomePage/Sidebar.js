import { auth } from "@/utils/firebase";
import { Avatar, Button, Card, CardBody, CardHeader, Divider, Popover, PopoverTrigger, PopoverContent, User } from "@nextui-org/react";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { FaUser, FaHome, FaCompass, FaList, FaBookmark, FaCog, FaBars } from 'react-icons/fa';

export default function Sidebar({ onItemSelect }) {
    const [avatarURL, setAvatarURL] = useState(null);
    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
    });
    const [isOpen, setIsOpen] = useState(false);
    const sideBarItems = [
        { name: "Home", icon: FaHome },
        { name: "Profile", icon: FaUser },
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
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex items-center h-screen">
                <Card className="w-[500px] p-10 align-middle fixed">
                    <CardHeader className="grid grid-cols-1">
                        <div>
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

            <div className="lg:hidden">
                <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="left">
                    <PopoverTrigger>
                        <Button isIconOnly aria-label="Open Sidebar" className="fixed top-4 left-4">
                            <FaBars />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Card className="w-[300px] p-4">
                            <CardHeader className="grid grid-cols-1">
                                <div>
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
                                        onClick={() => {
                                            onItemSelect(item.name);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <item.icon className="mr-2" />
                                        {item.name}
                                    </Button>
                                ))}
                            </CardBody>
                        </Card>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    )
}