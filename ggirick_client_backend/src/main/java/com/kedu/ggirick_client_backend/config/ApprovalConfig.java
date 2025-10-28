package com.kedu.ggirick_client_backend.config;

public class ApprovalConfig {
    public static final int TYPE_APPROVE = 1;
    public static final int TYPE_REJECT = 2;
    public static final int TYPE_COMMENT = 3;
    public static final int TYPE_CANCEL = 4;

    public static final int ITEM_PER_PAGE = 12;
    public static final int PAGE_PER_NAV = 5;

    // 휴가신청
    public static final String DOC_TYPE_VACATION = "VAC";
    // 연장근무 신청
    public static final String DOC_TYPE_OVERTIME = "OWR";
    // 휴일근무 신청
    public static final String DOC_TYPE_HOLIDAY = "HWR";
    // 근무체크 수정 요청
    public static final String DOC_TYPE_WORK_CHECK = "WCE";
    // 업무연락
    public static final String DOC_TYPE_CONTACT = "CON";
}
