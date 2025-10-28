import { useEffect } from 'react';

import useReservationStore from '../../../store/reservation/useReservationStore';
export default function ResourceListTab() {
  const {
    resourceList,
    fetchResources,

    isLoading,
      OpenCreateModalWithResource,

  } = useReservationStore();

  useEffect(() => {
    fetchResources(); // 컴포넌트 마운트 시 리소스 목록 로드
  }, [fetchResources]);

  if (isLoading) return <progress className="progress w-full"></progress>;
  if (resourceList.length === 0) return <div className="text-center p-8">등록된 리소스가 없습니다.</div>;

    return (
    <div>
      <h2 className="text-2xl font-bold mb-4">예약 가능한 리소스 목록</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourceList.map(resource => (
          <div key={resource.id} className="card bg-base-200/10/20 shadow-xl hover:shadow-2xl transition-shadow"> {/* DaisyUI card */}
            <figure className="h-48 overflow-hidden">
              {/* picsum 등의 demo 이미지 링크 사용 */}
              <img
                src={resource.imgUrl || `https://picsum.photos/id/${resource.id % 100}/400/300`}
                alt={resource.name}
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body p-4">
              <h3 className="card-title text-xl">{resource.name}</h3>
              <p className="text-sm text-base-content line-clamp-2">{resource.description}</p>
              <div className="card-actions justify-end mt-2">
                <button
                  onClick={() => OpenCreateModalWithResource(resource.id)}
                  className="btn btn-primary btn-sm" // DaisyUI button
                >
                  예약하기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}