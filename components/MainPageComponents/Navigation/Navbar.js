import React, { useEffect, useState } from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
    Input,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    User
} from "@nextui-org/react";
import { SearchIcon } from "../../Icons/SearchIcon";
import UploadIcon from "../../Icons/UploadIcon";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "@/utils/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import SettingsIcon from "../../Icons/SettingsIcon";
import HelpIcon from "../../Icons/HelpIcon";
import NotificationsIcon from "../../Icons/NotificationsIcon";
import SignOutIcon from "../../Icons/SignOutIcon";
import { doSignOut } from "@/utils/ConfigFunctions";
import Link from "next/link";
import { useRouter } from "next/router";
import ProfileIcon from "../../Icons/ProfileIcon";
import { storage } from "@/utils/Firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

export default function NavBar() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profilePicture, setProfilePicture] = useState([]);
    const [displaySearchBar, setDisplaySearchBar] = useState(false);

    const router = useRouter();
    let { uid } = router.query; // query against url for uid 

    const imageListRef = ref(storage, "images/")

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                getUserProfile(user.uid);
            } else {
                setUsername(null);
            }
        });

        return () => unsubscribe();

    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await listAll(imageListRef).then((response) => {
                    response.items.forEach((item) => {
                        getDownloadURL(item).then((url) => {
                            setProfilePicture(url);
                        })
                    })
                })
                // setProfilePicture(response.items[0]._location.path);
            } catch (error) {
                console.error("Error listing images:", error);
            }
        };

        fetchImages();
    }, []);

    async function getUserProfile(uid) {
        try {
            const db = getFirestore();
            const userReference = doc(db, "users", uid);
            const userSnapshot = await getDoc(userReference);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                setUsername(userData.username);
                setEmail(userData.email);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }




    return (
        <Navbar isBordered>
            <NavbarBrand className="visible max-sm:hidden">
                <Button variant="light" className="text-blue-800 text-xl font-bold">
                    Socialkick
                </Button>
            </NavbarBrand>
            <NavbarContent>
                <Button variant="light" className={`sm:hidden ${displaySearchBar ? "hidden" : "flex"}`} text-blue-800 onClick={() => setDisplaySearchBar(!displaySearchBar)}>
                    <SearchIcon />
                </Button>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Input
                        type="text"
                        placeholder="Search"
                        className="w-[35rem] focus:text-default-500"
                        color="primary"
                        size="2xl"
                        startContent={<SearchIcon />}
                        endContent={<Button className="text-blue-400" variant="light">Search</Button>}
                        isClearable
                        onClear={() => console.log("clear")}
                        maxLength={29}
                        classNames={{
                            input: [
                                "text-blue-800",
                                "placeholder:text-blue-800",
                                "focus:text-blue-800",
                            ],
                        }}
                    />
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button variant="light" className={`bg-blue-100 rounded-5 ${displaySearchBar ? "hidden" : "flex"}`}>
                        <UploadIcon className="w-[1.2em] md:w-[1.7em] " />
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    {displaySearchBar ?
                        <div className="flex mx-auto">
                            <Input
                                type="search"
                                placeholder="Search"
                                className="w-[150px] focus:text-default-500"
                                color="primary"
                                size="2xl"
                                startContent={<SearchIcon />}
                                classNames={{
                                    input: [
                                        "text-blue-800",
                                        "placeholder:text-blue-800",
                                        "focus:text-blue-800",
                                    ],
                                }}
                            />

                        </div>
                        :

                        <Dropdown showArrow className={`border-2 border-default-200 drop-shadow-xl ${displaySearchBar ? "hidden" : "flex"}`}>
                            <DropdownTrigger>
                                <Avatar className={`${displaySearchBar ? "hidden" : "flex"}`} src={profilePicture} />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User menu">
                                <DropdownSection title="Account" showDivider>
                                    <DropdownItem key="username" textValue={username}>
                                        <User name={username} description={email} avatarProps={{ src: profilePicture }} />
                                    </DropdownItem>
                                </DropdownSection>
                                <DropdownSection title="Management" showDivider>
                                    <DropdownItem>
                                        <Link href={`/${uid}/profile/Profile`}>

                                            <p className="flex items-center gap-2">
                                                <ProfileIcon />
                                                Profile
                                            </p>
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem className="flex">
                                        <Link href={`/${uid}/profile/Settings`}>
                                            <p className="flex items-center gap-2">
                                                <SettingsIcon />
                                                Settings
                                            </p>
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <Link href={`/${uid}/profile/Notifications`}>
                                            <p className="flex items-center gap-2">
                                                <NotificationsIcon />
                                                Notifications
                                            </p>
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <Link href="/HelpCenter">
                                            <p className="flex items-center gap-2">
                                                <HelpIcon />
                                                Help Center
                                            </p>
                                        </Link>
                                    </DropdownItem>
                                </DropdownSection>
                                <DropdownSection>
                                    <DropdownItem onClick={doSignOut}>
                                        <Link href="/">
                                            <p className="text-red-600 flex items-center gap-2">
                                                <SignOutIcon />
                                                Sign Out
                                            </p>
                                        </Link>
                                    </DropdownItem>
                                </DropdownSection>
                            </DropdownMenu>
                        </Dropdown>
                    }
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}