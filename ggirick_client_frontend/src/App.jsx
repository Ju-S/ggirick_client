import {BrowserRouter} from 'react-router-dom';
import EmployeeRoutes from "./routes/EmployeeRoutes.jsx";
import Nav from "./components/common/nav/Nav.jsx";
import {ThemeProvider} from "./context/ThemeContext.jsx";

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Nav/>
                <EmployeeRoutes/>
            </BrowserRouter>
        </ThemeProvider>
    );
}
