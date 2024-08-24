"use client"
import MobileNavBar from "@/components/MainPageComponents/Navigation/MobileNavBar";
import NavBar from "@/components/MainPageComponents/Navigation/Navbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Card, CardHeader, Divider } from "@nextui-org/react";

export default function Settings() {
    // if > 640px, show desktop navbar, else show mobile navbar
    // returns boolean determining if desktop or mobile
    const isDesktop = useMediaQuery("(min-width: 640px)");
    return (
        <>
        {isDesktop ? <NavBar /> : <MobileNavBar />}
        </>
    )
}