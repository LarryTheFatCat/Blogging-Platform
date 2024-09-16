import { auth, db } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Card, CardHeader, CardBody, User, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Loading from "@/pages/Loading";

export default function HomeBodyContentChildren() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [toggleProfile, setToggleProfile] = useState(false);
    const [hasPost, setHasPost] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) router.push("/");
            if (currentUser) {
                setUser(currentUser);
                fetchPosts();
            } else {
                setUser(null);
                setPosts([]);
                setHasPost(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchPosts = async () => {
        const usersRef = collection(db, "users");
        const userSnapshots = await getDocs(usersRef);
        let allPosts = [];

        for (const userDoc of userSnapshots.docs) {
            const userData = userDoc.data();
            const userPosts = userData.posts || {};
            const userPostsArray = Object.entries(userPosts).map(([id, post]) => ({
                id,
                ...post,
                userId: userDoc.id,
                userDisplayName: userData.displayName,
                userPhotoURL: userData.photoURL,
                userEmail: userData.email
            }));
            allPosts = [...allPosts, ...userPostsArray];
        }

        allPosts.sort((a, b) => b.timestamp - a.timestamp);

        setPosts(allPosts);
        setHasPost(allPosts.length > 0);
    };

    return (
        <div>
            {user ? (
                hasPost ? (
                    <div className="mt-5 space-y-4">
                        {posts.map((post) => (
                            <Card key={post.id} className="p-5">
                                <CardHeader>
                                    <div>
                                        <div className="flex">
                                            <Tooltip onClick={() => console.log("hello")} showArrow="true" content={
                                                <Link href={`${user.uid}/${post.userId}`}>
                                                    <User className="cursor-pointer" avatarProps={{ src: post.userPhotoURL }} name={post.userDisplayName} description="Click to view profile" />
                                                </Link>
                                            }>
                                                <User
                                                    avatarProps={{ src: post.userPhotoURL }}
                                                    name={post.userDisplayName}
                                                    description={post.userEmail}
                                                    onClick={() => setToggleProfile(!toggleProfile)}
                                                />
                                            </Tooltip>

                                            <p className="text-gray-500 font-thin self-center absolute right-5 text-sm">
                                                {post.createdAt}
                                            </p>
                                        </div>
                                        <h1 className="text-2xl font-semibold">
                                            {post.title}
                                        </h1>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    {post.description}
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <>
                    <Loading />
                    </>
                )
            ) : (
                <p>Please sign in to view posts.</p>
            )}
        </div>
    );
}

