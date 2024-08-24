"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IconHome from "@/components/Icons/MobileNavIconSet/MobileNavIconHome";
import { SearchIcon } from '@/components/Icons/SearchIcon';
import ProfileNavIcon from "@/components/Icons/MobileNavIconSet/ProfileNavIcon";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/Firebase";

export default function MobileNavBar() {
    const router = useRouter();
    const [uid, setUid] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
            } else {
                setUid(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const navigateTo = (path) => {
        if (uid) {
            router.push(`/${uid}${path}`);
        }
    };

    return (
        <div className="fixed bottom-0 w-full h-16 bg-white shadow-2xl drop-shadow-2xl">
            <div className="grid grid-cols-3 h-full">
                <NavItem icon={<IconHome className="mx-auto" />} label="Home" onClick={() => navigateTo('/home')} />
                <NavItem icon={<SearchIcon className="mx-auto" />} label="Search" onClick={() => navigateTo('/Search/Search')} />
                <NavItem icon={<ProfileNavIcon className="mx-auto" />} label="Profile" onClick={() => navigateTo('/profile/Profile')} />
            </div>
        </div>
    );
}

function NavItem({ icon, label, onClick }) {
    return (
        <div className="grid grid-cols-1 justify-center items-center border-r-2 h-full" onClick={onClick}>
            <div className="flex flex-col justify-center items-center h-full text-black">
                {icon}
                <h3 className="text-center text-sm mt-1">
                    {label}
                </h3>
            </div>
        </div>
    );
}