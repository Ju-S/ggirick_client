package com.kedu.ggirick_client_backend.controllers.hr;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.hr.AnnualLeaveGrantDTO;
import com.kedu.ggirick_client_backend.services.hr.VacationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workmanagement/vacation")
@RequiredArgsConstructor
public class VacationController {
    private final VacationService vacationService;

    // 직원별 연차 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<AnnualLeaveGrantDTO>> getAnnualLeaveListByEmployeeId(@AuthenticationPrincipal UserTokenDTO userInfo) {
        List<AnnualLeaveGrantDTO> list = vacationService.getAnnualLeaveListByEmployeeId(userInfo.getId());
        return ResponseEntity.ok(list);
    }

    // 잔여 휴가 조회
    @GetMapping("/remaining")
    public ResponseEntity<Double> getRemainingVacation(@AuthenticationPrincipal UserTokenDTO userInfo) {
        double remaining = vacationService.getRemainingVacation(userInfo.getId());
        return ResponseEntity.ok(remaining);
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
