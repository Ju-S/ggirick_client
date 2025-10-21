import {useState} from "react";

export default function LoginInputForm({loginInfo, setLoginInfo}) {


    const handleChange = (e) => {
        const {name, value} = e.target;
        setLoginInfo(prev => ({...prev, [name]:value}))
    }

    return (
        <div className="form-control flex flex-col gap-2 justify-center items-center p-1">
            <input
                type="text"
                placeholder="로그인 ID"
                className="input input-bordered p-2"
                onChange={handleChange}
                name="id"
                value={loginInfo.id}
            />
            <input
                type="password"
                placeholder="비밀번호"
                className="input input-bordered p-2"
                onChange={handleChange}
                name="pw"
                value={loginInfo.pw}
            />
        </div>
    );
}