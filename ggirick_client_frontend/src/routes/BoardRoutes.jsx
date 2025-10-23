import {Route, Routes} from "react-router-dom";
import BoardPage from "../pages/board/BoardPage.jsx";
import BoardDetailPage from "../pages/board/BoardDetailPage.jsx";
import BoardPostingPage from "../pages/board/BoardPostingPage.jsx";
import BoardLayout from "@/pages/board/BoardLayout.jsx";

export default function BoardRoutes() {
    return (
        <BoardLayout>
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
                <Route
                    path="edit/:id"
                    element={<BoardPostingPage editMode={true}/>}
                ></Route>
            </Routes>
        </BoardLayout>
    );
}