import {BrowserRouter} from 'react-router-dom';
import EmployeeRoutes from "./routes/EmployeeRoutes.jsx";
import Nav from "./commons/components/nav/Nav.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Nav/>
            <EmployeeRoutes/>
        </BrowserRouter>
    );
}
