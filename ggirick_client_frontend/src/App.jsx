import {BrowserRouter} from 'react-router-dom';
import EmployeeRoutes from "./routes/EmployeeRoutes.jsx";
import Nav from "./components/common/nav/Nav.jsx";
import {ThemeProvider} from "./context/ThemeContext.jsx";
import SideNav from "@/components/common/sideNav/SideNav.jsx";

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <div className="flex flex-col h-screen">
                    {/* 상단 네비 */}
                    <Nav />
                    <SideNav/>
                    {/* 메인 컨텐츠 */}
                    <div className="flex-1 overflow-hidden">
                        <EmployeeRoutes />
                    </div>
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}
