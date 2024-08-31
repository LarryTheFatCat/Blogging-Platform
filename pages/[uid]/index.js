import HomeContent from "@/components/HomePage/Components/HomeContent";
import ProfileContent from "@/components/HomePage/Components/ProfileContent";
import SettingsContent from "@/components/HomePage/Components/SettingsContent";
import Sidebar from "@/components/HomePage/Sidebar";
import { useState } from "react";
export default function BlogHome() {
    const [selectedItem, setSelectedItem] = useState("Home");
    const renderContent = () => {
        switch (selectedItem) {
            case "Home":
                return <HomeContent />
            case "Profile":
                return <ProfileContent />
            case "Settings":
                return <SettingsContent />
            default:
                return <HomeContent />
        }
    }
    return (
        <div className="px-10">
            <div className="flex-1 grid grid-cols-2 h-full">
                <div className="grid col-span-1">
                    <Sidebar onItemSelect={setSelectedItem} />
                </div>
                <div className="grid col-span-1 h-full">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}