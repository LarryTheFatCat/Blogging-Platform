import LikedIcon from "@/components/icons/LikedIcon";
import PostsIcon from "@/components/icons/PostsIcon";
import {
    Button,
    CircularProgress,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tab,
    Tabs,
    Textarea,
    useDisclosure
} from "@nextui-org/react";
import { useState, useEffect, useRef } from "react";
import { doc, increment, runTransaction } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { auth, db } from "@/utils/firebase";

export default function ProfileBodyChildComponent() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const [titleValue, setTitleValue] = useState("");
    const [titleMaxChars, setTitleMaxChars] = useState(0);
    const [titleProgressState, setTitleProgressState] = useState({
        primaryState: "primary",
        warningState: "warning",
        dangerState: "danger",
        currentState: "primary"
    });
    const [progressState, setProgressState] = useState(
        {
            primaryState: "primary",
            warningState: "warning",
            dangerState: "danger",
        }
    );
    const [maxChars, setMaxChars] = useState(0);
    const MAX_CHARS = 280;
    const [fileError, setFileError] = useState("");
    const fileInputRef = useRef(null);
    const [hasPost, setHasPost] = useState(false);

    const handleInput = (e) => {
        const newInput = e.target.value;
        setInput(newInput);
        setMaxChars((newInput.length / MAX_CHARS) * 100);
        updateProgressState(newInput.length);
    }
    const updateTitleValue = (e) => {
        const titleInput = e.target.value;
        setTitleValue(titleInput);
        setTitleMaxChars((titleInput.length / MAX_CHARS) * 100);
        updateTitleProgressState(titleInput.length);
    }

    const updateProgressState = (length) => {
        if (length >= 195) {
            setProgressState({ ...progressState, currentState: "danger" });
        } else if (length >= 139) {
            setProgressState({ ...progressState, currentState: "warning" });
        } else {
            setProgressState({ ...progressState, currentState: "primary" });
        }
    }

    const updateTitleProgressState = (length) => {
        if (length >= 195) {
            setTitleProgressState(prev => ({ ...prev, currentState: "danger" }));
        } else if (length >= 139) {
            setTitleProgressState(prev => ({ ...prev, currentState: "warning" }));
        } else {
            setTitleProgressState(prev => ({ ...prev, currentState: "primary" }));
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setFileError("");
            } else {
                setFileError("Please upload only image files.");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        }
    };

    useEffect(() => {
        updateProgressState(input.length);
        updateTitleProgressState(titleValue.length);
    }, [input, titleValue]);

    const createPost = async () => {
        if (!auth.currentUser) return;
        setIsLoading(true);
        const userRef = doc(db, "users", auth.currentUser.uid);

        try {
            await runTransaction(db, async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists()) {
                    throw "User document does not exist!";
                }

                const numberOfPost = userDoc.data().numberOfPost || 0;
                const newPostNumber = numberOfPost + 1;

                const newPost = {
                    [`posts.post_${newPostNumber}`]: {
                        title: titleValue,
                        description: input,
                        createdAt: new Date().toISOString(),
                    }
                };

                transaction.update(userRef, {
                    ...newPost,
                    numberOfPost: increment(1)
                });
            });
            setHasPost(true);
            setTitleValue("");
            setInput("");
        } finally {
            setIsLoading(false);
            window.location.reload();
        }
    };

    return (
        <>
            <Tabs aria-label="Profile tabs" className="mx-auto">
                <Tab key="posts" title={
                    <div className="flex items-center gap-x-2">
                        <PostsIcon />
                        Posts
                    </div>
                }>
                    <Button color="primary" onPress={onOpen} isIconOnly radius="full">
                        +
                    </Button>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {
                                (onClose) => (
                                    <>
                                        <ModalHeader>
                                            <h1 className="text-2xl font-bold">
                                                Create a post
                                            </h1>
                                        </ModalHeader>
                                        <ModalBody>
                                            <Input
                                                label="Title of post"
                                                labelPlacement="outside"
                                                placeholder="What's happening?!"
                                                variant="faded"
                                                color={titleProgressState.currentState}
                                                value={titleValue}
                                                onChange={updateTitleValue}
                                                maxLength={MAX_CHARS}
                                                endContent={
                                                    <CircularProgress
                                                        size="sm"
                                                        color={titleProgressState.currentState}
                                                        value={titleMaxChars}
                                                        maxValue={100}
                                                        showValueLabel={true}
                                                    />
                                                }
                                            />
                                            <Textarea
                                                value={input}
                                                onChange={handleInput}
                                                label="Description of post"
                                                labelPlacement="outside"
                                                placeholder="This is some awesome content!"
                                                variant="faded"
                                                color={progressState.currentState}
                                                maxLength={MAX_CHARS}
                                                endContent={
                                                    <CircularProgress
                                                        size="sm"
                                                        color={progressState.currentState}
                                                        value={maxChars}
                                                        maxValue={100}
                                                        showValueLabel={true}
                                                    />
                                                }
                                            />
                                            <Input
                                                type="file"
                                                label="Upload an image to post"
                                                color="primary"
                                                variant="faded"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                                description={fileError && <span className="text-danger">{fileError}</span>}
                                            />
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button variant="bordered" color="danger" onPress={onClose}>
                                                Cancel
                                            </Button>
                                            <Button isLoading={isLoading} variant="bordered" color="primary" onClick={createPost} onPress={onClose}>
                                                Create post
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )
                            }
                        </ModalContent>
                    </Modal>
                    {!hasPost && (
                        <h1 className="text-4xl text-center font-bold w-[50%] mx-auto pt-10">
                            Seems pretty empty here... Make a post to get started!
                        </h1>
                    )}
                </Tab>
                <Tab key="liked-posts" title={
                    <div className="flex items-center gap-x-2">
                        <LikedIcon />
                        Liked Posts
                    </div>
                }>
                    <p>Liked Posts content goes here</p>
                </Tab>
            </Tabs>
        </>
    )
}