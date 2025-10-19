import { Modal, ModalBody, ModalHeader, Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useAddressStore } from "../../store/address/modalStore.js";
import api from "../../commons/api/apiInterceptor.js";

export default function AddAddressModal() {
  const openModal = useAddressStore((state) => state.openModal);
  const setOpenModal = useAddressStore((state) => state.setOpenModal);
  const selectedSubGroupId = useAddressStore((state) => state.selectedSubGroupId);
  const setSelectedSubGroupId = useAddressStore((state) => state.setSelectedSubGroupId);
  const addContact = useAddressStore((state) => state.addContact);

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    department: "",
    rank: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const payload = { ...form, groupId: selectedSubGroupId };

    api.post("/address", payload)
      .then((res) => {
        addContact(res.data);
        setForm({ name: "", companyName: "", department: "", rank: "", email: "", phone: "", address: "" });
        setOpenModal(false);
        setSelectedSubGroupId(null);
      })
      .catch(() => alert("주소록 추가 실패"));
  };

  return (
    <Modal show={openModal} size="lg" onClose={() => setOpenModal(false)}>
      <ModalHeader>새 연락처 추가</ModalHeader>
      <ModalBody>
        <TextInput name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
        <TextInput name="companyName" placeholder="회사" value={form.companyName} onChange={handleChange} />
        <TextInput name="department" placeholder="부서" value={form.department} onChange={handleChange} />
        <TextInput name="rank" placeholder="직급" value={form.rank} onChange={handleChange} />
        <TextInput name="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
        <TextInput name="phone" placeholder="전화번호" value={form.phone} onChange={handleChange} required />
        <TextInput name="address" placeholder="주소" value={form.address} onChange={handleChange} />
        <div className="flex justify-end gap-2 mt-4">
          <Button color="gray" onClick={() => setOpenModal(false)}>취소</Button>
          <Button color="blue" onClick={handleSubmit}>추가</Button>
        </div>
      </ModalBody>
    </Modal>
  );
}