package com.kedu.ggirick_client_backend.dto.approval;

import lombok.*;

import java.sql.Timestamp;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalDTO {
    private int id;
    private String title;
    private String writer;
    private String name; // 작성자 이름
    private String departmentName; // 작성자 부서명
    private String content; // JSON형태로 양식에 따라 바뀔 내용
    private Integer typeId; // 결재서류 현 상태(승인, 반려, 대기, 의견)
    private String docTypeCode; // 결재서류 종류(휴가, 업무연락 등)
    private Timestamp createdAt;
    private Timestamp updatedAt; // 결재서류 수정 시간(재승인 용도)
    private Timestamp assignedAt; // 결재서류 승인 시간
    private String lastAssigner; // 마지막 결재자

    // 종류에 따라 필요한 필드
    private Map<String, Object> docData;
    private String docDataJson;

//    // 휴가, 연장, 휴일근무 신청 시 필요한 시작-끝 시간
//    private Timestamp startAt;
//    private Timestamp endAt;
//
//    // 근무수정 신청 시 필요한 수정 코드
//    private int workTimeId;
//    private Timestamp recordedAt;
//    private String workTimeType;
}
