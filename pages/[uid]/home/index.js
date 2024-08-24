import MobileNavBar from "@/components/MainPageComponents/Navigation/MobileNavBar";
import NavBar from "@/components/MainPageComponents/Navigation/Navbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Home() {
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    return (
        <>
        {isDesktop ? <NavBar /> : <MobileNavBar />}
            <div className="mx-20 mt-10">
                <div className="grid grid-cols-3">
                    <div className="col-span-1">
                        <div className="grid grid-rows-2">
                            <div className="grid row-span-1">
                            </div>
                            <div className="grid row-span-1 mt-5">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}