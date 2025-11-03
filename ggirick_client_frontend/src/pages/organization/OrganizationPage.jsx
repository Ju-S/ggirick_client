import {useEffect, useState} from "react";
import {ChevronDown, ChevronRight, Users} from "lucide-react";
import {getHrMetaStructureAPI} from "@/api/common/employeeMetaAPI.js";

export default function OrganizationPage() {
    const [orgData, setOrgData] = useState([]);
    const [selectedOrgCode, setSelectedOrgCode] = useState("");
    const [expandedNodes, setExpandedNodes] = useState(new Set());

    const rankOrderMap = {
        "대표": 1, "부사장": 2, "부장": 3, "차장": 4,
        "과장": 5, "대리": 6, "사원": 7, "인턴": 8
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getHrMetaStructureAPI();
                console.log(res.data);
                const transformed = res.data.map(org => transformOrgNode(org));
                setOrgData(transformed);
                if (res.data.length > 0) setSelectedOrgCode(res.data[0].code);
            } catch (err) {
                console.error("조직도 로드 실패:", err);
            }
        };
        fetchData();
    }, []);

    const toggleNode = (nodeId) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) newSet.delete(nodeId);
            else newSet.add(nodeId);
            return newSet;
        });
    };

    const buildHierarchyByRankShared = (employees) => {
        if (!employees || employees.length === 0) return [];


        const sorted = [...employees].sort((a, b) => (rankOrderMap[a.jobName] || 99) - (rankOrderMap[b.jobName] || 99));

// 직급 그룹화
        const groups = [];
        let currentRank = null;
        sorted.forEach(emp => {
            if (emp.jobName !== currentRank) {
                currentRank = emp.jobName;
                groups.push([]);
            }
            groups[groups.length - 1].push(emp);
        });

// 모든 노드를 Map으로 생성
        const nodesById = new Map();
        groups.forEach(group => {
            group.forEach(emp => {
                if (!nodesById.has(emp.id)) {
                    nodesById.set(emp.id, {
                        id: emp.id,
                        name: emp.name,
                        position: emp.jobName,
                        department: emp.department,
                        image: emp.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=3b82f6&color=fff&size=128`,
                        email: emp.email+"@ggirick.site",
                        children: []
                    });
                }
            });
        });

// 그룹별 계층: 상위 그룹의 모든 노드가 하위 그룹의 모든 노드를 자식으로 공유
        const levels = groups.map(group => group.map(emp => nodesById.get(emp.id)));
        for (let i = 0; i < levels.length - 1; i++) {
            levels[i].forEach(parent => {
                levels[i + 1].forEach(child => {
                    parent.children.push(child);
                });
            });
        }

        return levels[0]; // 최상위 그룹 반환

    };

    const transformOrgNode = (org) => {
        const children = org.departments.map(dept => ({
            id: dept.code,
            name: dept.name,
            position: "",
            department: dept.name,
            image: "",
            children: buildHierarchyByRankShared(dept.employees),
        }));

        return {
            id: org.code,
            name: org.name,
            position: "",
            department: org.name,
            image: "",
            children
        };
    };

    const countLeaves = (node) => {
        if (!node.children || node.children.length === 0 || !expandedNodes.has(node.id)) return 1;
        return node.children.reduce((sum, c) => sum + countLeaves(c), 0);
    };

    const OrgNode = ({node}) => {
        const isExpanded = expandedNodes.has(node.id);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div className="flex flex-col items-center relative">
                <div className="relative z-10">
                    <div
                        className="bg-base-100 rounded-lg shadow-lg border-2 border-base-200 p-4 w-64 hover:shadow-xl transition-shadow">
                        <div className="flex items-center space-x-4">
                            <img
                                src={node.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(node.name)}&size=128`}
                                alt={node.name}
                                className="w-16 h-16 rounded-full border-2 border-primary"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-base-content truncate">{node.name}</h3>
                                <p className="text-sm font-medium text-primray">{node.position}</p>
                                <p className="text-xs text-accent truncate">{node.department}</p>
                                <p className="text-xs text-accent truncate">{node.email}</p>
                            </div>
                        </div>

                        {hasChildren && (
                            <button
                                onClick={() => toggleNode(node.id)}
                                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-accent hover:bg-accent-content text-accent-content rounded-full p-1 shadow-md transition-colors z-10"
                            >
                                {isExpanded ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
                            </button>
                        )}
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="flex flex-col items-center mt-8 relative">
                        <div className="w-0.5 h-8 bg-primary"></div>
                        <div className="flex gap-8 relative">
                            {node.children.length > 1 && (
                                <div
                                    className="absolute top-0 h-0.5 bg-primary"
                                    style={{
                                        left: `${(countLeaves(node.children[0]) * 288) / 2}px`,
                                        right: `${(countLeaves(node.children[node.children.length - 1]) * 288) / 2}px`
                                    }}
                                />
                            )}
                            {node.children.map(child => (
                                <div key={child.id} className="flex flex-col items-center relative">
                                    <div className="w-0.5 h-8 bg-primary"></div>
                                    <OrgNode node={child}/>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );


    };

    const selectedOrg = orgData.find(o => o.id === selectedOrgCode);

    return (<div className="min-h-screen md:ml-64 bg-gradient-to-br from-base-200 to-base-300 p-8 pt-20">
            <div className="max-w-7xl mx-auto">
                {/* 헤더 */}
                <div className="bg-base-100 rounded-lg shadow-md p-6 mb-8 flex items-center space-x-3"><Users
                    className="w-8 h-8 text-primary"/>
                    <div><h1 className="text-3xl font-bold text-base-content">조직도</h1> <p className="text-base-content/30">조직을 선택하여
                        트리를 표시하세요</p></div>
                </div>

                {/* 조직 선택 */}
                <div className="mb-6">
                    <select
                        value={selectedOrgCode}
                        onChange={e => setSelectedOrgCode(e.target.value)}
                        className="select select-bordered w-64"
                    >
                        {orgData.map(org => (
                            <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                    </select>
                </div>

                {/* 선택된 조직 트리 */}
                <div className="bg-base-100 rounded-lg shadow-md p-8 overflow-x-auto">
                    <div className="inline-block min-w-full">
                        {selectedOrg ? <OrgNode node={selectedOrg}/> : <div>조직도를 선택해주세요.</div>}
                    </div>
                </div>
            </div>
        </div>

    );
}
