export default function useApprovalGroup() {
    const groupItems = [
        {name: "전체", id: 0},
        {name: "대기", id: 1},
        {name: "진행중", id: 2},
    ];

    const boxItems = [
        {name: "전체", id: 3},
        {name: "기안", id: 4},
        {name: "결재", id: 5},
        {name: "반려", id: 6},
    ];

    return {groupItems: groupItems, boxItems: boxItems};
}