import {Route, Routes} from "react-router-dom";
import BoardPage from "../pages/board/BoardPage.jsx";
import BoardDetailPage from "../pages/board/BoardDetailPage.jsx";
import BoardPostingPage from "../pages/board/BoardPostingPage.jsx";
import BoardSidebar from "@/components/board/BoardSidebar.jsx";

export default function BoardRoutes() {
    return (
        <Routes>
            <Route
                index
                element={<BoardPage/>}
            ></Route>
            <Route
                path=":id"
                element={<BoardDetailPage/>}
            ></Route>
            <Route
                path="posting"
                element={<BoardPostingPage/>}
            ></Route>
        </Routes>
    );
}