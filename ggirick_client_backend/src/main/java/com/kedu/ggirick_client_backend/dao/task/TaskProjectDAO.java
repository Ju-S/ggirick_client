package com.kedu.ggirick_client_backend.dao.task;

import com.kedu.ggirick_client_backend.dto.task.ProjectDTO;
import com.kedu.ggirick_client_backend.dto.task.ProjectMemberDTO;
import com.kedu.ggirick_client_backend.dto.task.TaskDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class TaskProjectDAO {
    @Autowired
    private SqlSession mybatis;


    //프로젝트 관련 필드


    //전체 프로젝트 가져오기ㅣ
    public List<ProjectDTO> getProjects(){
        return mybatis.selectList("taskProject.findAllProjects");
    }

    //프로젝트 만들기
    public boolean createProject(ProjectDTO projectDTO) {
        return mybatis.insert("taskProject.createProject", projectDTO)>0;
    }
    //프로젝트 삭제하기
    public boolean deleteProjectById(Long id) {
        return mybatis.delete("taskProject.deleteProjectById", id)>0;
    }
    //프로젝트 업데이트 하기
    public boolean updateProject(ProjectDTO projectDTO) {
        return mybatis.update("taskProject.updateProjectNameAndDesc", projectDTO)>0;
    }
    //특정 사용자가 관여한 프로젝트 가져오기
    public List<ProjectDTO> findProjectsByEmployeeId(String employeeId){
        return mybatis.selectList("taskProject.findMyProjectsById", employeeId);
    }

    //멤버 관련 필드


    //프로젝트 멤버 가져오기
    public List<ProjectMemberDTO> getMembers(long projectId){
        return mybatis.selectList("taskProject.findMembersByProjectId", projectId);
    }

    //프로젝트 단일 멤버 추가하기
    public boolean insertProjectMember(ProjectMemberDTO member){
        return mybatis.insert("taskProject.insertProjectMember", member)>0;
    }


    //프로젝트 여러 멤버 추가하기
    public  boolean insertProjectMembers(List<ProjectMemberDTO> members){
        return mybatis.insert("taskProject.insertProjectMembers", members)>0;
    }

    //해당 멤버가 존재하는지 확인하기
    public boolean existsMember(long projectId, String employeeId) {
        Map<String, Object> params = Map.of("projectId", projectId, "employeeId", String.valueOf(employeeId));
        Integer result = mybatis.selectOne("taskProject.existsMember", params);
        return result != null && result == 1;
    }

    public boolean deleteProjectMember(ProjectMemberDTO member) {
        return mybatis.delete("taskProject.deleteProjectMember", member)>0;
    }

    //업무 (Task)관련 DAO


    //업무 만들기
    public boolean createTask(TaskDTO taskDTO) {
        return mybatis.insert("taskProject.createTask", taskDTO)>0;
    }


    //한 프로젝트 안에 있는 모든 업무 가져오기
    public List<TaskDTO> getTasks(long projectId){
        return mybatis.selectList("taskProject.findTasksByProjectId", projectId);
    }

    //업무 아이디로 업무 삭제하기
    public boolean deleteTaskById(Long id) {
        return mybatis.delete("taskProject.deleteTaskById", id)>0;
    }

    //업무 아이디 기준으로 업무 수정하기
    public boolean updateTaskById(Long id, TaskDTO taskDTO) {
        return mybatis.update("taskProject.updateTaskById", taskDTO)>0;
    }

    //업무 아이디로 하나의 업무 가져오기
    public TaskDTO findTaskById(Long id) {
        return mybatis.selectOne("taskProject.findTaskById", id);
    }


    //아이디 기준으로 업무 상태만 수정하기
    public boolean updateTaskStatusById(TaskDTO dto) {
        return mybatis.update("taskProject.updateTaskStatusById", dto)>0;

    }
}
