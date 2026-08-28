import Header from "../components/ui/header/header";
import Footer from "../components/ui/footer/footer";
import { Outlet } from "react-router-dom";

function RootLayout() {
    return (
        <>
            <Header />
            
            <main>
                <Outlet />
            </main>

            <Footer />
        </>
    )
}

export default RootLayout;