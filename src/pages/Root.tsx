import Header from "../components/ui/header/header";
import { Outlet } from "react-router-dom";

function RootLayout() {
    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default RootLayout;