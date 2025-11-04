import { Modal, ModalBody, ModalHeader, Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useAddressStore } from "../../store/address/modalStore.js";
import api from "../../api/common/apiInterceptor.js";
import { updateAddressAPI } from "../../api/address/api.jsx";

export default function AddAddressModal() {
  const openModal = useAddressStore((state) => state.openModal);
  const setOpenModal = useAddressStore((state) => state.setOpenModal);
  const selectedSubGroupId = useAddressStore((state) => state.selectedSubGroupId);
  const addContact = useAddressStore((state) => state.addContact);

  const editMode = useAddressStore((state) => state.editMode);
  const setEditMode = useAddressStore((state) => state.setEditMode);
  const editingContact = useAddressStore((state) => state.editingContact);
  const updateContact = useAddressStore((state) => state.updateContact);

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    department: "",
    rank: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (editMode && editingContact) {
      setForm(editingContact);
    } else {
      setForm({
        name: "",
        companyName: "",
        department: "",
        rank: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [editMode, editingContact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      let formatted = value.replace(/\D/g, "");
      if (formatted.length > 3 && formatted.length <= 7) formatted = `${formatted.slice(0, 3)}-${formatted.slice(3)}`;
      else if (formatted.length > 7) formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 7)}-${formatted.slice(7, 11)}`;
      setForm((prev) => ({ ...prev, [name]: formatted }));
    } else setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = { ...form, groupId: selectedSubGroupId };

    if (editMode) {
      updateAddressAPI(form.id, payload)
        .then(() => {
          updateContact({ ...payload, id: form.id }); // payload로 바로 테이블 반영
          closeModal();
        })
        .catch(() => alert("주소 수정 실패"));
    } else {
      api.post("/address", payload)
        .then(() => {
          addContact({ ...payload, id: Date.now() }); // 새로 추가된 연락처 바로 UI 반영
          closeModal();
        })
        .catch(() => alert("주소록 추가 실패"));
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setForm({
      name: "",
      companyName: "",
      department: "",
      rank: "",
      email: "",
      phone: "",
      address: "",
    });
  };

    return (
        <Modal show={openModal} size="lg" onClose={closeModal}>
            <div className="bg-base-300 text-base-content text-lg px-6 py-3">
                {editMode ? "연락처 수정" : "새 연락처 추가"}
            </div>

            <ModalBody className="bg-base-100 text-base-content p-6">
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        name="name"
                        placeholder="이름"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        name="companyName"
                        placeholder="회사"
                        value={form.companyName}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        name="department"
                        placeholder="부서"
                        value={form.department}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        name="rank"
                        placeholder="직급"
                        value={form.rank}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        className="input input-bordered w-full"
                        name="email"
                        placeholder="이메일"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        className="input input-bordered w-full"
                        name="phone"
                        placeholder="전화번호"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        name="address"
                        placeholder="주소"
                        value={form.address}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button className="btn btn-ghost" onClick={closeModal}>
                        취소
                    </button>
                    <button
                        className={editMode ? "btn btn-success" : "btn btn-primary"}
                        onClick={handleSubmit}
                    >
                        {editMode ? "수정" : "추가"}
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
}