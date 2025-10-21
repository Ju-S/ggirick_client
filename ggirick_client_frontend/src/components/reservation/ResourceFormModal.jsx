
import { useState } from 'react';
import useReservationStore from '../../store/reservation/useReservationStore';

import BaseModal from '../../components/common/BaseModal';
import {insertAPI} from "@/api/reservation/resourceAPI.js";

export default function ResourceFormModal() {
  const {
    isResourceModalOpen,
    setResourceModalOpen,
    fetchResources // 리소스 생성 성공 후 목록 새로고침
  } = useReservationStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imgUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('리소스 이름을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      // POST /reservations/resource
       insertAPI(formData);
      alert('리소스가 성공적으로 생성되었습니다.');
      setResourceModalOpen(false);
      await fetchResources(); // 리소스 목록 새로고침
      setFormData({ name: '', description: '',imgUrl:'' }); // 폼 초기화

    } catch (error) {
      alert('리소스 생성 중 오류가 발생했습니다.');
      console.error("Resource creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setResourceModalOpen(false);
  };

  return (
    <BaseModal
      isOpen={isResourceModalOpen}
      onClose={closeModal}
      title="새 리소스 생성"

    >
      <form onSubmit={handleSubmit}>

        {/* 리소스 이름 */}
        <div className="form-control w-full mb-4">
          <label className="label"><span className="label-text">리소스 이름 *</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        {/* 리소스 이미지 */}
        <div className="form-control w-full mb-4">
          <label className="label"><span className="label-text">이미지 주소 *</span></label>
          <input
            type="text"
            name="imgUrl"
            value={formData.imgUrl}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* 설명 */}
        <div className="form-control w-full mb-4">
          <label className="label"><span className="label-text">설명</span></label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered"
            placeholder="회의실 위치, 장비 목록 등"
          />
        </div>

        <div className="modal-action justify-end">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? <span className="loading loading-spinner"></span> : '생성'}
          </button>
          <button type="button" className="btn" onClick={closeModal}>취소</button>
        </div>
      </form>
    </BaseModal>
  );
}