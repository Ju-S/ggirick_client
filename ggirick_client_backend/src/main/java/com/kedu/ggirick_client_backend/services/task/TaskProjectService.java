package com.kedu.ggirick_client_backend.services.task;

import com.kedu.ggirick_client_backend.dao.task.TaskProjectDAO;
import com.kedu.ggirick_client_backend.dto.task.ProjectDTO;
import com.kedu.ggirick_client_backend.dto.task.ProjectMemberDTO;
import com.kedu.ggirick_client_backend.dto.task.TaskDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskProjectService {

    private final int PROJECT_ADMIN_CODE = 1;
    private final int PROJECT_MEMBER_CODE = 2;

    @Autowired
    private TaskProjectDAO taskProjectDAO;


    //전체 프로젝트 목록 가져오기
    public List<ProjectDTO> getProjects() {
        List<ProjectDTO> projects = taskProjectDAO.getProjects();
        return processProjects(projects);
    }

    //로그인한 사용자가 참여해있는 프로젝트 가져오기
    public List<ProjectDTO> getMyProjects(String loginId) {

        List<ProjectDTO> projects = taskProjectDAO.findProjectsByEmployeeId(loginId);
        return processProjects(projects);
    }

    /**
     * 각 프로젝트에 멤버/태스크/기간 정보를 세팅하는 공통 처리 메서드
     */
    private List<ProjectDTO> processProjects(List<ProjectDTO> projects) {
        return projects.stream().map(p -> {
            // 멤버 목록
            List<ProjectMemberDTO> members = taskProjectDAO.getMembers(p.getId());
            p.setMembers(members);

            // 태스크 목록
            List<TaskDTO> tasks = taskProjectDAO.getTasks(p.getId());
            p.setTasks(tasks);

            // 기간 계산 (StartedAt ~ EndedAt)
            if (!tasks.isEmpty()) {
                LocalDate start = tasks.stream()
                        .map(TaskDTO::getStartedAt)
                        .min(LocalDate::compareTo)
                        .orElse(null);

                LocalDate end = tasks.stream()
                        .map(TaskDTO::getEndedAt)
                        .max(LocalDate::compareTo)
                        .orElse(null);

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

                String range = "";
                if (start != null && end != null) {
                    range = start.format(formatter) + " ~ " + end.format(formatter);
                }

                p.setRange(range);
            } else {
                p.setRange("");
            }


            return p;
        }).collect(Collectors.toList());
    }


    public boolean updateTaskStatus(Long id, String status) {
        TaskDTO dto = new TaskDTO();
        dto.setId(id);
        dto.setStatus(status);
        return taskProjectDAO.updateTaskStatusById(dto);

    }

    public boolean deleteTaskById(Long id) {
        return taskProjectDAO.deleteTaskById(id);
    }

    public boolean createTask(TaskDTO taskDTO, String loginId) {
        taskDTO.setAssigner(loginId);
        return taskProjectDAO.createTask(taskDTO);
    }

    public boolean updateTaskById(Long id,String loginId, TaskDTO taskDTO) {
        taskDTO.setAssigner(loginId);
        return taskProjectDAO.updateTaskById(id, taskDTO);
    }

    @Transactional
    public boolean createProject(ProjectDTO projectDTO,String loginId) {
       projectDTO.setCreatedBy(loginId);



        boolean success = taskProjectDAO.createProject(projectDTO);
         ProjectMemberDTO projectMemberDTO = new ProjectMemberDTO();

         projectMemberDTO.setProjectId(projectDTO.getId());
         projectMemberDTO.setEmployeeId(loginId);
         projectMemberDTO.setRoleId(PROJECT_ADMIN_CODE); //프로젝트를 만든 사람이 admin


       boolean insertSuccess =  taskProjectDAO.insertProjectMember(projectMemberDTO);
        return success && insertSuccess;
    }

    public boolean deleteProject(Long id) {
        return taskProjectDAO.deleteProjectById(id);
    }

    public boolean updateProject(ProjectDTO projectDTO) {
        return taskProjectDAO.updateProject(projectDTO);
    }

    //멤버 관련

    //멤버를 프로젝틓에 추가
    public boolean addMemberToProject(ProjectMemberDTO member) {
        boolean exists = taskProjectDAO.existsMember(member.getProjectId(), member.getEmployeeId());
        if (exists) {
            return false; // 이미 등록된 경우 추가 X
        }

        return taskProjectDAO.insertProjectMember(member);
    }


    public boolean deleteMemberToProject(ProjectMemberDTO member) {
        boolean exists = taskProjectDAO.existsMember(member.getProjectId(), member.getEmployeeId());
        if(exists){
            return taskProjectDAO.deleteProjectMember(member);
        }else{
            return false;
        }

    }

    @Transactional
    public boolean syncProjectMembers(Long projectId, List<String> employeeIds) {

        //  현재 DB에 존재하는 멤버 조회
        List<String> existingMemberIds = taskProjectDAO.getMembers(projectId)
                .stream()
                .map(ProjectMemberDTO::getEmployeeId)
                .collect(Collectors.toList());

        //  삭제할 멤버: DB에는 존재하지만 프론트에서 보내지 않은 멤버
        List<String> toRemove = existingMemberIds.stream()
                .filter(id -> !employeeIds.contains(id))
                .collect(Collectors.toList());

        //  추가할 멤버: DB에는 없지만 프론트에서 새로 보내온 멤버
        List<String> toAdd = employeeIds.stream()
                .filter(id -> !existingMemberIds.contains(id))
                .collect(Collectors.toList());

        // 삭제 처리
        for (String id : toRemove) {
            ProjectMemberDTO member = new ProjectMemberDTO();
            member.setProjectId(projectId);
            member.setEmployeeId(id);
            taskProjectDAO.deleteProjectMember(member);
        }

        // 추가 처리
        for (String id : toAdd) {
            ProjectMemberDTO member = new ProjectMemberDTO();
            member.setProjectId(projectId);
            member.setEmployeeId(id);
            member.setRoleId(PROJECT_MEMBER_CODE);
            taskProjectDAO.insertProjectMember(member);
        }

        return true;
    }



    //멤버 아이디 리스트를 받아서 프로젝트에 추가

    public boolean addMembersToProject(Long projectId, List<String> employeeIds) {

        for (String employeeId : employeeIds) {
            boolean exists = taskProjectDAO.existsMember(projectId, employeeId);


            if (!exists) {
                ProjectMemberDTO member = new ProjectMemberDTO();
                member.setProjectId(projectId);
                member.setEmployeeId(employeeId);
                member.setRoleId(PROJECT_MEMBER_CODE);

                System.out.println("프로젝트 안에 존재하지 않는다고 판단된 멤버아이디: "+member.getEmployeeId());

                boolean inserted = addMemberToProject(member);
                if (!inserted) {
                    return false;
                }
            }
        }
        return true;
    }

}
