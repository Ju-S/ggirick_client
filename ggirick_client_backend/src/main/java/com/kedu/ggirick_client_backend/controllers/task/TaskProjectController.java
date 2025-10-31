package com.kedu.ggirick_client_backend.controllers.task;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.task.ProjectDTO;
import com.kedu.ggirick_client_backend.dto.task.ProjectMemberDTO;
import com.kedu.ggirick_client_backend.dto.task.TaskDTO;
import com.kedu.ggirick_client_backend.services.task.TaskProjectService;
import com.kedu.ggirick_client_backend.utils.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/project")
public class TaskProjectController {

    @Autowired
    private TaskProjectService projectService;

    @Autowired
    private FileUtil fileUtil;

    /*
     * Project 관련 CRUD
     *
     * */
    @PostMapping
    public ResponseEntity<Map<String, Boolean>> createProject(@RequestBody ProjectDTO projectDTO,@AuthenticationPrincipal UserTokenDTO userInfo) {
        boolean success = projectService.createProject(projectDTO, userInfo.getId());
        Map<String, Boolean> response = new HashMap<>();
        response.put("result", success);
        return ResponseEntity.ok(response);
    }


    @GetMapping()
    public List<ProjectDTO> getMyProjects(@AuthenticationPrincipal UserTokenDTO userInfo) {
        return projectService.getMyProjects(userInfo.getId());
    }


    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> updateProject(@PathVariable Long id, @RequestBody ProjectDTO projectDTO) {
        projectDTO.setId(id);
        boolean success = projectService.updateProject(projectDTO);
        Map<String, Boolean> map = new HashMap<>();
        map.put("result", success);
        return ResponseEntity.ok(map);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteProjectById(@PathVariable Long id) {
        boolean success = projectService.deleteProject(id);
        Map<String, Boolean> map = new HashMap<>();
        map.put("result", success);
        return ResponseEntity.ok(map);
    }
    /*
     * task 관련 CRUD
     * /task/{id}/status는 오로지 status만 바꾸는 경우만 다룸.(칸반보드)
     * */

    @PostMapping("/task")
    public ResponseEntity<Map<String, Boolean>> createTask(@RequestBody TaskDTO taskDTO, @AuthenticationPrincipal UserTokenDTO userInfo) {
        String loginId = userInfo.getId();
        boolean success = projectService.createTask(taskDTO, loginId);

        Map<String, Boolean> map = new HashMap<>();
        map.put("result", success);
        return ResponseEntity.ok(map);
    }

    @PatchMapping("/task/{id}/status")
    public ResponseEntity<Map<String, Boolean>> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {


        String status = body.get("status");
        boolean success = projectService.updateTaskStatus(id, status);
        Map<String, Boolean> map = new HashMap<>();
        map.put("result", success);
        return ResponseEntity.ok(map);
    }

    @PutMapping("/task/{id}")
    public ResponseEntity<Map<String, Boolean>> updateTaskById(
            @PathVariable Long id,
            @RequestBody TaskDTO taskDTO,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        String loginId= userInfo.getId();
        boolean success = projectService.updateTaskById(id,loginId, taskDTO);
        Map<String, Boolean> map = new HashMap<>();
        map.put("result", success);
        return ResponseEntity.ok(map);

    }

    @DeleteMapping("/task/{id}")
    public ResponseEntity<Map<String, Boolean>> updateTaskStatus(
            @PathVariable Long id) {
        boolean success = projectService.deleteTaskById(id);
        Map<String, Boolean> map = new HashMap<>();
        map.put("result", success);
        return ResponseEntity.ok(map);
    }

    //프로젝트에 멤버 추가

    @PostMapping("/member")
    public ResponseEntity<Map<String, Boolean>> insertTaskMember(@RequestBody ProjectMemberDTO projectMemberDTO) {
        boolean success = projectService.addMemberToProject(projectMemberDTO);
        Map<String, Boolean> map = new HashMap<>();
        map.put("result", success);
        return ResponseEntity.ok(map);

    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<Map<String, Boolean>> syncProjectMembers(
            @PathVariable Long projectId,
            @RequestBody List<String> employeeIds) {

        System.out.println("projectId: " + projectId);
        System.out.println("employeeIds: " + employeeIds);

        boolean success = projectService.syncProjectMembers(projectId, employeeIds);
        Map<String, Boolean> map = new HashMap<>();
        map.put("result", success);
        return ResponseEntity.ok(map);
    }

    @PostMapping("/task/file")
    public ResponseEntity<Map<String, String>> uploadTaskFile(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, String> fileInfo = fileUtil.uploadFileAndGetInfo(file.getOriginalFilename(), "task/", file);
            return ResponseEntity.ok(fileInfo);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

}