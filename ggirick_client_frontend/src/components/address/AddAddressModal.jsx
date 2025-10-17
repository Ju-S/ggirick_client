import { Modal,ModalBody,ModalHeader, Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import {useAddressStore} from "../../store/address/modalStore.js";
import api from "../../commons/api/apiInterceptor.js";

export default function AddAddressModal() {
    const openModal = useAddressStore((state)=>state.openModal);
    const setOpenModal = useAddressStore((state)=>state.setOpenModal);
    const addContact = useAddressStore((state)=>state.addContact);

    const [form, setForm] = useState({
        name: "",
        company: "",
        department: "",
        rank: "",
        email: "",
        phone: "",
        address: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = () => {

      api.post("/address",form).then(response=>{
        console.log("서버응답 : " ,response.data);
        addContact(response.data); // zustand store에 추가함
        setForm({
          name: "",
          companyName: "",
          department: "",
          rank: "",
          email: "",
          phone: "",
          address: "",
        })
        setOpenModal(false);
      })
        .catch(error=>{
          alert("주소록 추가에 실패하였습니다. 다시 확인해주세요.");
        })

    };

    return (
            <Modal show={openModal} size="lg" onClose={() => setOpenModal(false)} >
                <ModalHeader/>
                <ModalBody>
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">새 연락처 추가</h3>
                        <p className="text-sm text-gray-500">
                            새로 연락처 정보를 입력해주세요. <span className="text-red-500">*</span> 표시는 필수 항목입니다.
                        </p>

                        {/* 이름 */}
                        <div>
                            <Label htmlFor="name" value="이름 *" />
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="홍길동"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 회사명 */}
                        <div>
                            <Label htmlFor="company" value="회사명" />
                            <TextInput
                                id="company"
                                name="company"
                                placeholder="(주)테크컴퍼니"
                                value={form.companyName}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 부서 */}
                        <div>
                            <Label htmlFor="department" value="부서" />
                            <TextInput
                                id="department"
                                name="department"
                                placeholder="개발팀"
                                value={form.department}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 직급 */}
                        <div>
                            <Label htmlFor="rank" value="직급" />
                            <TextInput
                                id="rank"
                                name="rank"
                                placeholder="대리"
                                value={form.rank}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 이메일 */}
                        <div>
                            <Label htmlFor="email" value="이메일 *" />
                            <TextInput
                                id="email"
                                name="email"
                                type="email"
                                placeholder="hong@company.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 전화번호 */}
                        <div>
                            <Label htmlFor="phone" value="전화번호 *" />
                            <TextInput
                                id="phone"
                                name="phone"
                                placeholder="010-1234-5678"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 주소 */}
                        <div>
                            <Label htmlFor="address" value="주소" />
                            <TextInput
                                id="address"
                                name="address"
                                placeholder="서울시 강남구 테헤란로 123"
                                value={form.address}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 버튼 */}
                        <div className="flex justify-end gap-2 mt-4">
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                취소
                            </Button>
                            <Button color="blue" onClick={handleSubmit}>
                                추가
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
    );
}