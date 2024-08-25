import { Button, Image } from "@nextui-org/react";
import nopage from "@/components/404/noPage.gif"
import { useRouter } from "next/router";

function PageNotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center" css={{ pt: "$12" }}>
            <Image
                src={nopage.src}
                alt="404 Not Found"
                width={1200}
            />
            <Button 
                onClick={() => router.back()} 
                color="success" 
                auto 
                css={{ mt: "$8" }}
            >
                Go Back
            </Button>
        </div>
    );
}

export default PageNotFound;