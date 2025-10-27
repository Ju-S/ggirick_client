import {Route, Routes} from "react-router-dom";
import AddressPage from "../pages/address/AddressPage.jsx";
import "flowbite/dist/flowbite.css";
import BoardRoutes from "./BoardRoutes.jsx";
import Dashboard from "@/pages/dashboard/Dashboard.jsx";
import ReservationPage from "@/pages/reservation/ReservationPage.jsx";
import TaskPage from "@/pages/task/TaskPage.jsx";
import ChatPage from "@/pages/chat/ChatPage.jsx";
import MailPage from "@/pages/mail/MailPage.jsx";
import ApprovalPage from "@/pages/approval/ApprovalPage.jsx";
import ApprovalRoutes from "@/routes/ApprovalRoutes.jsx";

export default function EmployeeRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}></Route>
            <Route path="/board/*" element={<BoardRoutes/>}/>
            <Route
                path="/approval/*"
                element={<ApprovalRoutes/>}
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
                element={<ReservationPage/>}
            ></Route>
            <Route
                path="/task"
                element={<TaskPage/>}
            ></Route>
            <Route
                path="/mail"
                element={<MailPage/>}
            ></Route>
            <Route
                path="/address"
                element={<AddressPage/>}
            ></Route>
            <Route
                path="/chat"
                element={<ChatPage/>}
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