import { auth, db } from "@/utils/firebase";
import { Accordion, AccordionItem, Avatar, Button, Card, CardBody, CardHeader, Divider, Tooltip } from "@nextui-org/react";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import BioIcon from "@/components/icons/BioIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import GenderIcon from "@/components/icons/GenderIcon";
import PronounsIcon from "@/components/icons/PronounsIcon";
import { onAuthStateChanged } from "firebase/auth";

export default function NewUserHomepage() {
    // State variables for managing user data, UI state, and current user
    const router = useRouter();
    const [userProfile, setUserProfile] = useState(null);
    const [toggleButton, setToggleButton] = useState(false);
    const [loading, setLoading] = useState(false);
    const [preventSelfFollow, setPreventSelfFollow] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Fetch user profile data when the router is ready
        async function fetchUserProfile() {
            if (router.isReady) {
                const { OtherUserName } = router.query;
                if (OtherUserName) {
                    const profile = await getUserProfile(OtherUserName);
                    setUserProfile(profile);
                }
            }
        }
        fetchUserProfile();

        // Set up authentication state listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        // Clean up the auth listener on component unmount
        return () => unsubscribe();
    }, [router.isReady, router.query]);

    async function getUserProfile(uid) {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            console.log('No such user!');
            return null;
        }
    }
    // console.log(userProfile.numberOfFollowers)
    const followUser = async () => {
        if (!currentUser) return;
        if (currentUser.displayName === userProfile.username) {
            setPreventSelfFollow(true);
            return;
        }

        setLoading(true);
        try {
            const userReference = doc(db, "users", userProfile.uid);
            await updateDoc(userReference, {
                numberOfFollowers: increment(1)
            });
            setToggleButton(true);
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false);
        }
    }
    const removeFollower = async () => {
        setLoading(true);
        try {
            const userReference = doc(db, "users", userProfile.uid);
            await updateDoc(userReference, {
                numberOfFollowers: increment(-1),
            });
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false);
            setToggleButton(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-96">
                <CardHeader>
                    <div className="text-center mx-auto">
                        {userProfile ? (
                            <div className="text-center">
                                <Avatar
                                    className="h-40 w-40 mx-auto"
                                    radius="md"
                                    src={userProfile.photoURL || "/default-avatar.png"}
                                    alt={userProfile.name || "User"}
                                />
                                <h1 className="text-3xl font-bold mb-4">{userProfile.displayName}</h1>
                                <Divider className="w-[100%]" />
                                <div className="flex items-center justify-center mb-2">
                                    <BioIcon className="mr-2" />
                                    <h5 className="text-lg font-thin">
                                        {userProfile.bio}
                                    </h5>
                                </div>
                                <div className="flex items-center justify-center mb-2">
                                    <LocationIcon className="mr-2" />
                                    <h5 className="text-lg font-thin">
                                        {userProfile.location}
                                    </h5>
                                </div>
                                <div className="flex items-center justify-center mb-2">
                                    <GenderIcon className="mr-2" />
                                    <h5 className="text-lg font-thin">
                                        {userProfile.gender}
                                    </h5>
                                </div>
                                <div className="flex items-center justify-center mb-2">
                                    <PronounsIcon className="mr-2" />
                                    <h5 className="text-lg font-thin">
                                        {userProfile.pronouns}
                                    </h5>
                                </div>
                            </div>
                        ) : (
                            <Loading />
                        )}
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="w-full pb-5">
                        <Accordion variant="shadow">
                            <AccordionItem title="View Posts">
                                {userProfile && userProfile.posts ? (
                                    Object.entries(userProfile.posts).map(([postId, postContent]) => (
                                        <Card key={postId} className="mb-2">
                                            <CardHeader>
                                                <h3 className="text-lg font-semibold">{postContent.title}</h3>
                                            </CardHeader>
                                            <CardBody>
                                                <p>{postContent.description}</p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Created at: {new Date(postContent.createdAt).toLocaleString()}
                                                </p>
                                            </CardBody>
                                        </Card>
                                    ))
                                ) : (
                                    <p>No posts available</p>
                                )}
                            </AccordionItem>
                        </Accordion>
                    </div>
                    <div className="grid grid-cols-2">
                        {toggleButton
                            ?
                            <Button isLoading={loading} onClick={removeFollower} variant="bordered" color="primary">
                                Unfollow
                            </Button>
                            :
                            <Tooltip isOpen={preventSelfFollow} color="danger" content="Hey stop right there! You can't follow yourself silly 😊">
                                <Button isDisabled={preventSelfFollow} isLoading={loading} onClick={followUser} variant="bordered" color="primary">
                                    Follow
                                </Button>
                            </Tooltip>
                        }
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}