import { useEffect, useState, useMemo } from "react";
import useReservationStore from "../../../store/reservation/useReservationStore";
import { getResourceTypesAPI } from "@/api/reservation/resourceAPI.js";

export default function ResourceListTab() {
    const { resourceList, fetchResources, isLoading, OpenCreateModalWithResource } = useReservationStore();

    const [resourceTypes, setResourceTypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

    useEffect(() => {
        fetchResources();
        fetchResourceTypes();
    }, [fetchResources]);

    const fetchResourceTypes = async () => {
        try {
            const res = await getResourceTypesAPI();
            setResourceTypes(res.data);
        } catch (err) {
            console.error("Failed to fetch resource types:", err);
        }
    };

    const typeMap = useMemo(() => {
        const map = {};
        resourceTypes.forEach((t) => {
            map[t.typecode] = t.name;
        });
        return map;
    }, [resourceTypes]);

    const filteredResources = useMemo(() => {
        return resourceList.filter((r) => {
            const matchesName = r.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = typeMap[r.type]?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesName || matchesType;
        });
    }, [resourceList, searchQuery, typeMap]);

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">예약 가능한 리소스 목록</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="검색 (이름/타입)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-bordered w-full sm:w-64"
                    />
                    <button
                        className="btn btn-sm"
                        onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    >
                        {viewMode === "grid" ? "리스트 뷰" : "그리드 뷰"}
                    </button>
                </div>
            </div>

            {isLoading && <progress className="progress w-full mb-4"></progress>}
            {!isLoading && filteredResources.length === 0 && (
                <div className="text-center p-8 text-gray-500">등록된 리소스가 없습니다.</div>
            )}

            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                {filteredResources.map((resource) => (
                    <div
                        key={resource.id}
                        className={`card bg-base-200 shadow-lg hover:shadow-xl transition-shadow flex ${
                            viewMode === "grid" ? "flex-col" : "flex-row"
                        }`}
                    >
                        <figure
                            className={`overflow-hidden ${
                                viewMode === "grid" ? "h-48 w-full" : "h-32 w-48 flex-shrink-0"
                            }`}
                        >
                            <img
                                src={resource.imgUrl || `https://picsum.photos/id/${resource.id % 100}/400/300`}
                                alt={resource.name}
                                className="w-full h-full object-cover"
                            />
                        </figure>

                        <div className="card-body p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="card-title flex items-center gap-2">
                                    {resource.name}
                                    {resource.type && (
                                        <span className="badge badge-secondary">{typeMap[resource.type]}</span>
                                    )}
                                </h3>
                                <p className="text-sm text-base-content line-clamp-2">{resource.description}</p>
                            </div>

                            <div className="card-actions justify-end mt-2">
                                <button
                                    onClick={() => OpenCreateModalWithResource(resource.id)}
                                    className="btn btn-primary btn-sm"
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
