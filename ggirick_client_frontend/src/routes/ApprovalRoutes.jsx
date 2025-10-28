import {Route, Routes} from "react-router-dom";
import ApprovalPage from "@/pages/approval/ApprovalPage.jsx";
import ApprovalLayout from "@/pages/approval/ApprovalLayout.jsx";
import ApprovalDetailPage from "@/pages/approval/ApprovalDetailPage.jsx";
import ApprovalPostingPage from "@/pages/approval/ApprovalPostingPage.jsx";

export default function ApprovalRoutes() {
    return (
        <ApprovalLayout>
            <Routes>
                <Route
                    index
                    element={<ApprovalPage/>}
                ></Route>
                <Route
                    path=":id"
                    element={<ApprovalDetailPage/>}
                ></Route>
                <Route
                    path="posting"
                    element={<ApprovalPostingPage/>}
                ></Route>
                <Route
                    path="edit/:id"
                    element={<ApprovalPostingPage editMode={true}/>}
                ></Route>
            </Routes>
        </ApprovalLayout>
    );
}