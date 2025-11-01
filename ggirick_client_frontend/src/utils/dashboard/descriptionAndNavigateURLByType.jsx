import {timestampToMonthDay, timestampToMonthDayTime} from "@/utils/common/dateFormat.js";
import useReservationStore from "@/store/reservation/useReservationStore.js";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";
import useRecentActivitiesInfo from "@/hooks/dashboard/useRecentActivitiesInfo.js";

const descriptionAndNavigateURLByType = (e) => {
    let description = "";
    let navigateURL = "";

    const setActiveTab = useReservationStore(state => state.setActiveTab);
    const setSelectedProjectId = useTaskProjectStore(state => state.setSelectedProjectId);

    const {
        calendarGroupList,
        docTypeList,
        boardGroupList,
    } = useRecentActivitiesInfo();

    switch (e.type) {
        case "reservation": {
            const startEndDate =
                timestampToMonthDayTime(e.rawData.startedAt) + " ~ " +
                timestampToMonthDayTime(e.rawData.endedAt);

            description = (
                <div className="flex flex-col">
                    <div className="tooltip" data-tip={e.rawData?.resourceName + "을 예약하였습니다."}>
                        <div className="truncate">
                            <div className="badge badge-sm badge-accent badge-soft mb-1 mr-1">
                                예약
                            </div>
                            {e.rawData?.resourceName}을 예약하였습니다.
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-base-content-500">
                        <span></span>
                        <span className="truncate">
                            {startEndDate}
                        </span>
                    </div>
                </div>
            );
            setActiveTab("myReservations");
            navigateURL = "/reservation";
            break;
        }
        case "board":
        case "notification": {
            const createdAt = timestampToMonthDay(e.rawData?.createdAt);
            const boardGroup = boardGroupList.find(item => item.id === e.rawData?.boardGroupId);
            const boardGroupName = boardGroup ? boardGroup.name : "전사공지";

            description = (
                <div className="flex flex-col">
                    <div className="tooltip" data-tip={e.rawData?.title + "을 등록하였습니다."}>
                        <div className="truncate">
                            {e.type === "notification" ? (
                                <div className="badge badge-sm badge-warning badge-soft mb-1 mr-1">
                                    공지
                                </div>
                            ) : (
                                <div className="badge badge-sm badge-secondary badge-soft mb-1 mr-1">
                                    게시글
                                </div>
                            )}
                            <div className="badge badge-sm badge-base mb-1 mr-1">
                                {boardGroupName}
                            </div>
                            {e.rawData?.title}을 등록하였습니다.
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-base-content-500">
                        <span className="truncate">
                            작성자: {e.rawData?.name}
                        </span>
                        <span className="truncate">
                            {createdAt}
                        </span>
                    </div>
                </div>
            );
            navigateURL = "/board/" + e.rawData?.id;
            break;
        }
        case "task": {
            const startEndDate =
                timestampToMonthDayTime(e.rawData?.task?.startedAt) + " ~ " +
                timestampToMonthDayTime(e.rawData?.task?.endedAt);

            description = (
                <div className="flex flex-col">
                    <div className="tooltip" data-tip={e.rawData?.task.title + "을 등록하였습니다."}>
                        <div className="truncate">
                            <div className="badge badge-sm badge-primary badge-soft mb-1 mr-1">
                                업무
                            </div>
                            {e.rawData?.task?.title}을 등록하였습니다.
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-base-content-500">
                        <span className="truncate">
                            등록자: {e.rawData?.assignerName} / 담당자: {e.rawData?.assigneeName}
                        </span>
                        <span className="truncate">
                            {startEndDate}
                        </span>
                    </div>
                </div>
            );
            setSelectedProjectId(e.rawData?.task?.projectId);
            navigateURL = "/task";
            break;
        }

        case "pendingApproval":
        case "assignedApproval": {
            const createdAt = timestampToMonthDay(e.rawData?.createdAt);
            const docType = docTypeList.find(item => item.code === e.rawData?.docTypeCode);
            const docTypeName = docType ? docType.name : "";

            description = (
                <div className="flex flex-col">
                    <div className="tooltip" data-tip={e.rawData?.title + "을 기안하였습니다."}>
                        <div className="truncate">
                            <div className="badge badge-sm badge-info badge-soft mb-1 mr-1">
                                전자결재
                            </div>
                            <div className="badge badge-sm badge-base mr-1">
                                {docTypeName}
                            </div>
                            {e.rawData?.title}을 기안하였습니다.
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-base-content-500">
                        <span className="truncate">
                            기안자: {e.rawData?.name}
                        </span>
                        <span className="truncate">
                            {createdAt}
                        </span>
                    </div>
                </div>
            );
            navigateURL = "/approval/" + e.rawData?.id;
            break;
        }
        case "calendar": {
            const startEndDate =
                timestampToMonthDayTime(e.rawData?.startAt) + " ~ " +
                timestampToMonthDayTime(e.rawData?.endAt);
            const calendarGroup = calendarGroupList.find(item => item.id === e.rawData?.groupId);
            const calendarGroupName = calendarGroup ? calendarGroup.name : "개인일정";

            description = (
                <div className="flex flex-col">
                    <div className="tooltip" data-tip={e.rawData?.title + "을 등록하였습니다."}>
                        <div className="truncate">
                            <div className="badge badge-sm badge-error badge-soft mb-1 mr-1">
                                일정
                            </div>
                            {e.rawData?.groupId !== null ? (
                                <div className="badge badge-sm badge-base mb-1 mr-1">
                                    {calendarGroupName}
                                </div>
                            ) : (
                                <div className="badge badge-sm badge-base mb-1 mr-1">
                                    개인일정
                                </div>
                            )}
                            <span
                                className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 mr-1"
                                style={{backgroundColor: e.rawData.color || "#878787"}}/>
                            {e.rawData?.title}을 등록하였습니다.
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-base-content-500">
                        {e.rawData?.groupId !== null && (
                            <span className="truncate">
                                작성자: {e.rawData?.name}
                            </span>
                        )}
                        <span className="truncate">
                            {startEndDate}
                        </span>
                    </div>
                </div>
            );
            if (e.rawData?.groupId === null) {
                navigateURL = "/calendar";
            } else {
                navigateURL = "/calendar?groupId=" + e.rawData?.groupId;
            }
            break;
        }
    }

    return {description: description, navigateURL: navigateURL};
}

export default descriptionAndNavigateURLByType;