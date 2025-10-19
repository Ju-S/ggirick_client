import {Route, Routes} from "react-router-dom";
import BoardRoutes from "./BoardRoutes.jsx";
import Dashboard from "@/pages/dashboard/Dashboard.jsx";

export default function EmployeeRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}></Route>
            <Route path="/board/*" element={<BoardRoutes/>}/>
            <Route
                path="/approval"
                element={<>approval</>}
            ></Route>
            <Route
                path="/calendar"
                element={<>calendar</>}
            ></Route>
            <Route
                path="/workmanagement"
                element={<>workmanagement</>}
            ></Route>
            <Route
                path="/reservation"
                element={<>reservation</>}
            ></Route>
            <Route
                path="/task"
                element={<>task</>}
            ></Route>
            <Route
                path="/mail"
                element={<>mail</>}
            ></Route>
            <Route
                path="/address"
                element={<>address</>}
            ></Route>
            <Route
                path="/chat"
                element={<>chat</>}
            ></Route>
            <Route
                path="/videomeeting"
                element={<>videomeeting</>}
            ></Route>
            <Route
                path="/drive"
                element={<>drive</>}
            ></Route>
            <Route
                path="/organization"
                element={<>organization</>}
            ></Route>

            <Route
                path="*"
                element={<>error</>}
            ></Route>
        </Routes>
    );
}