import {create} from "zustand";

const useAuthStore = create(set => ({
    token: "",
    authority: "",
    isLogin: "none",
    login: ({token, authority}) => {
        if (token !== "" && authority !== "") {
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("authority", authority)
        }
        set({token: token, authority: authority, isLogin: true});
    },
    logout: () => {
        sessionStorage.clear();
        set({token: "", authority: "", isLogin: false});
    },
}));

export default useAuthStore;