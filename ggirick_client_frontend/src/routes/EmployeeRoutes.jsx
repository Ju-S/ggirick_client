import {Route, Routes} from "react-router-dom";

export default function EmployeeRoutes() {
    return (
        <Routes>
            <Route path="/" element={<>dashboard</>}></Route>
            <Route
                path="/board"
                element={<>board</>}
            ></Route>
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