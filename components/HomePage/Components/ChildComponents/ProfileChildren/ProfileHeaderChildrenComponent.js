import { auth, db } from "@/utils/firebase";
import {
    Avatar,
    CardHeader,
    Input,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Divider,
} from "@nextui-org/react";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import BioIcon from "@/components/icons/BioIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import GenderIcon from "@/components/icons/GenderIcon";
import PronounsIcon from "@/components/icons/PronounsIcon";

export default function ProfileHeaderChildrenComponent() {
    const [userInfo, setUserInfo] = useState({
        photoURL: null,
        displayName: null,
        bio: "",
        editedBio: "",
        location: "",
        gender: "",
        pronouns: "",
        numberOfPost: 0,
        numberOfFollowers: 0,
        numberOfFollowing: 0,
        numberOfPostList: [],
        numberOfFollowersList: [],
        numberOfFollowingList: [],
    });
    const [otherGender, setOtherGender] = useState("");
    const [editStates, setEditStates] = useState({
        isEditing: false,
        addLocation: false,
        editingGender: false,
        editingOtherGender: false,
        editingPronouns: false
    });

    const [loading, setLoading] = useState(false);

    // Add this new state to hold the following profiles
    const [followingProfiles, setFollowingProfiles] = useState([]);

    // Update functions for userInfo and editStates
    const updateUserInfo = (field, value) => {
        setUserInfo(prev => ({ ...prev, [field]: value }));
    };

    const updateEditState = (field, value) => {
        setEditStates(prev => ({ ...prev, [field]: value }));
    };

    const fetchUserData = async (uid) => {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log(userData);
            updateUserInfo("bio", userData.bio || "Click to add a bio.");
            updateUserInfo("location", userData.location || "Click to add a location");
            updateUserInfo("gender", userData.gender || "Click to add gender");
            updateUserInfo("pronouns", userData.pronouns || "Click to add pronouns");
            updateUserInfo("numberOfPost", userData.numberOfPost || 0);
            updateUserInfo("numberOfFollowers", userData.numberOfFollowers || 0);
            updateUserInfo("numberOfFollowing", userData.numberOfFollowing || 0);
            updateUserInfo("numberOfFollowingList", userData.numberOfFollowingList || 0);
        } else {
            updateUserInfo("bio", "Click to add a bio.");
            updateUserInfo("gender", "Click to add gender");
            updateUserInfo("pronouns", "Click to add pronouns");
            updateUserInfo("numberOfPost", 0);
            updateUserInfo("numberOfFollowers", 0);
            updateUserInfo("numberOfFollowing", 0);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;
            if (user) {
                updateUserInfo("photoURL", user.photoURL);
                updateUserInfo("displayName", user.displayName);
                await fetchUserData(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleEditClick = () => {
        updateEditState("isEditing", true);
        updateUserInfo("editedBio", userInfo.bio);
    };

    const handleSaveClick = async () => {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { bio: userInfo.editedBio });
            updateUserInfo("bio", userInfo.editedBio);
            updateEditState("isEditing", false);
            setLoading(false);
        }
    };

    const addLocationSave = async () => {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
            const uid = user.uid;
            const userDocRef = doc(db, "users", uid);
            await updateDoc(userDocRef, { location: userInfo.location });
            updateEditState("addLocation", false);
            setLoading(false);
        }
    };

    const handleLocationClick = () => {
        addLocationSave();
    };

    const handleGenderSave = async () => {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const genderToSave = editStates.editingOtherGender ? otherGender : userInfo.gender; // Check if "Other" is being edited
            await updateDoc(userDocRef, { gender: genderToSave });
            updateUserInfo("gender", genderToSave); // Update the user info with the selected gender
            updateEditState("editingGender", false);
            setLoading(false);
        }
    };
    console.log(userInfo.gender);

    const handlePronounsSave = async () => {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { pronouns: userInfo.pronouns });
            updateEditState("editingPronouns", false);
            setLoading(false);
        }
    };

    // const handleGenderSelect = (key) => {
    //     updateUserInfo("gender", key);
    // };
    console.log(otherGender);
    const handleAction = (key) => {
        if (key === "Other") {
            setEditStates(prevState => ({
                ...prevState,
                editingOtherGender: true,
            }));
        } else {
            setEditStates(prevState => ({
                ...prevState,
                editingOtherGender: false,
            }));
            updateUserInfo("gender", key);
        }
    };

    // Function to fetch profiles of users being followed
    const fetchFollowingProfiles = async () => {
        const profiles = await Promise.all(userInfo.numberOfFollowingList.map(async (uid) => {
            const userDocumentReference = doc(db, "users", uid);
            const userDocumentSnapshot = await getDoc(userDocumentReference);
            return userDocumentSnapshot.exists() ? userDocumentSnapshot.data() : null; // Return profile data or null
        }));
        setFollowingProfiles(profiles.filter(profile => profile !== null)); // Filter out nulls
    };

    // Call fetchFollowingProfiles when userInfo.numberOfFollowingList changes
    useEffect(() => {
        if (userInfo.numberOfFollowingList.length >= 0) {
            fetchFollowingProfiles();
        }
    }, [userInfo.numberOfFollowingList]);

    return (
        <CardHeader className="gap-x-5 grid grid-cols-1">
            <Avatar
                src={userInfo.photoURL}
                className="h-40 w-40 mx-auto"
                radius="md"
            />
            <h1 className="text-center pt-5 text-4xl">
                {userInfo.displayName}
            </h1>
            <div className="flex justify-center gap-x-10">
                <Button variant="light">
                    <h3 className="text-xl text-center font-thin text-gray-500">
                        Followers: {userInfo.numberOfFollowers}
                    </h3>
                </Button>
                <Button variant="light" className="hover:underline hover:cursor-pointer">
                    <h3 className="text-xl text-center font-thin text-gray-500">
                        Followers: {userInfo.numberOfFollowers}
                    </h3>
                </Button>
                <Button variant="light" className="hover:underline hover:cursor-pointer">
                    <h3 className="text-xl text-center font-thin text-gray-500">
                        Following: {userInfo.numberOfFollowing}
                    </h3>
                </Button>
            </div>
            <Divider className="my-3" />
            {editStates.isEditing ? (
                <div className="flex flex-col items-center gap-2">
                    <Input
                        variant="faded"
                        color="primary"
                        value={userInfo.editedBio}
                        placeholder="Enter your bio"
                        onChange={(e) => updateUserInfo("editedBio", e.target.value)}
                        maxLength={120}
                        isClearable
                    />
                    <Button
                        variant="bordered"
                        color="primary"
                        isLoading={loading}
                        onClick={handleSaveClick}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={() => updateEditState("isEditing", false)}
                        className="absolute right-16 top-60 w-10"
                        color="danger"
                        variant="bordered"
                        isIconOnly
                    >
                        X
                    </Button>
                </div>
            ) : (
                <>
                    <div className="flex mx-auto gap-x-5">
                        <BioIcon className="mx-auto self-center" />
                        <p
                            className="text-center text-lg text-gray-500 font-thin cursor-pointer"
                            onClick={handleEditClick}
                        >
                            {userInfo.bio}
                        </p>
                    </div>
                    <div className="flex mx-auto gap-x-5">
                        {editStates.addLocation ?
                            <div className="flex flex-col items-center gap-2">
                                <Input
                                    variant="faded"
                                    color="primary"
                                    value={userInfo.location}
                                    placeholder="Enter your location"
                                    onChange={(e) => updateUserInfo("location", e.target.value)}
                                    isClearable
                                />
                                <Button
                                    variant="bordered"
                                    color="primary"
                                    isLoading={loading}
                                    onClick={handleLocationClick}
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={() => updateEditState("addLocation", false)}
                                    className="absolute right-16 top-60 w-10"
                                    color="danger"
                                    variant="bordered"
                                    isIconOnly
                                >
                                    X
                                </Button>
                            </div>
                            :
                            <>
                                <LocationIcon className="self-center" />
                                <p
                                    className="text-center text-lg text-gray-500 font-thin cursor-pointer"
                                    onClick={() => updateEditState("addLocation", true)}
                                >
                                    {userInfo.location}
                                </p>
                            </>
                        }
                    </div>
                    <div className="flex mx-auto gap-x-5">
                        {editStates.editingGender ? (
                            <div className="flex flex-col items-center gap-2">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button variant="bordered">
                                            {userInfo.gender || "Select gender"}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Gender selection"
                                        onAction={handleAction}
                                        selectedKeys={new Set([userInfo.gender])}
                                        selectionMode="single"
                                    >
                                        <DropdownItem key="Male">Male</DropdownItem>
                                        <DropdownItem key="Female">Female</DropdownItem>
                                        <DropdownItem key="Non-binary">Non-binary</DropdownItem>
                                        <DropdownItem key="Other">Other</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                {editStates.editingOtherGender && (
                                    <Input
                                        label="Other"
                                        placeholder="Enter your identity"
                                        labelPlacement="outside"
                                        value={otherGender}
                                        onChange={(e) => setOtherGender(e.target.value)}
                                    />
                                )}
                                <Button variant="bordered" color="primary" isLoading={loading} onClick={handleGenderSave}>Save</Button>
                                <Button onClick={() => updateEditState("editingGender", false)} className="absolute right-16 top-60 w-10" color="danger" variant="bordered" isIconOnly>X</Button>
                            </div>
                        ) : (
                            <>
                                <GenderIcon className="self-center" />
                                <p
                                    className="text-center text-lg text-gray-500 font-thin cursor-pointer"
                                    onClick={() => updateEditState("editingGender", true)}
                                >
                                    {userInfo.gender}
                                </p>
                            </>
                        )}
                    </div>
                    <div className="flex mx-auto gap-x-5">
                        {editStates.editingPronouns ? (
                            <div className="flex flex-col items-center gap-2">
                                <Input
                                    variant="faded"
                                    color="primary"
                                    value={userInfo.pronouns}
                                    placeholder="Enter your pronouns"
                                    onChange={(e) => updateUserInfo("pronouns", e.target.value)}
                                    isClearable
                                />
                                <Button
                                    variant="bordered"
                                    color="primary"
                                    isLoading={loading}
                                    onClick={handlePronounsSave}
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={() => updateEditState("editingPronouns", false)}
                                    className="absolute right-16 top-60 w-10"
                                    color="danger"
                                    variant="bordered"
                                    isIconOnly
                                >
                                    X
                                </Button>
                            </div>
                        ) : (
                            <>
                                <PronounsIcon
                                    className="self-center"
                                />
                                <p
                                    className="text-center text-lg text-gray-500 font-thin cursor-pointer"
                                    onClick={() => updateEditState("editingPronouns", true)}
                                >
                                    {userInfo.pronouns}
                                </p>
                            </>
                        )}
                    </div>
                </>
            )
            }
        </CardHeader >
    );
}