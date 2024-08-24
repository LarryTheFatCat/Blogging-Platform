import NavBar from "@/components/MainPageComponents/Navigation/Navbar";

export default function Home() {
    return (
        <>
            <NavBar />
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