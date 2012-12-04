package com.dao;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.omg.PortableInterceptor.SUCCESSFUL;

import com.bean.CourseBean;
import com.bean.GroupBean;
import com.bean.ProjectBean;
import com.bean.UserBean;
import com.jndiLocator.getSourceLocator;

public class GroupDao {
	
	/**
	 * Assign members to a group.
	 *
	 * @param userIds		  the ids of the students who will be assigned to the group
	 * @param projectId 	  the id of the project
	 * @throws     			  Exception
	 */
	public void assignGroup(List<String> userIds, String groupId)throws Exception{
		Connection conn = null;
		PreparedStatement pstmt = null;
		try{
			conn = getSourceLocator.ds.getConnection();
			String sql ="insert into enrollgroup (group_id,student_id) values (?,?);";
			for(int i =0; i<userIds.size();i++){
				pstmt =conn.prepareStatement(sql);
				pstmt.setString(1, groupId);
				pstmt.setString(2, userIds.get(i));
				pstmt.executeUpdate();
			}
		   
		    conn.commit();
		}
		catch(Exception e){
			conn.rollback();
			throw e;
		}
		finally{
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
	}
	
	/**
	 * Gets all the students (user objects) according to a group id.
	 *
	 * @param groupId 	  the id of the group
	 * @return			  a list of user objects
	 * @throws     		  Exception
	 */
	public List<UserBean> getGroupMembers(String groupId) throws Exception{
		List<UserBean> groupMates = new ArrayList<UserBean>();
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try{
			conn = getSourceLocator.ds.getConnection();
			String sql ="select p.name,p.person_id from person p where p.person_id in (select student_id from enrollgroup e where e.group_id = ?);";
			pstmt =conn.prepareStatement(sql);
			pstmt.setInt(1, Integer.parseInt(groupId));
			rs = pstmt.executeQuery();
			while(rs.next()){
				UserBean userBean = new UserBean();
				userBean.setAccountId(rs.getString("person_id"));
				userBean.setUserName(rs.getString("name"));
				groupMates.add(userBean);
			}
		}
		catch(SQLException e){
			e.printStackTrace();
		}
		finally{
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return groupMates;
	}
	
	/**
	 * Gets all the courses (course objects) according to a student id.
	 *
	 * @param userId 	  the id of a user (student)
	 * @return			  a list of course objects
	 * @throws     		  Exception
	 */
	public List<CourseBean> getCourseListForStudent(String userId) throws Exception{
		List<CourseBean> courseList = new ArrayList<CourseBean>();
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try{
			conn = getSourceLocator.ds.getConnection();
			String sql ="select c.course_id,c.course_name from enrollcourse e, course c where student_id = ? and c.course_id = e.course_id ;";
			pstmt =conn.prepareStatement(sql);
			pstmt.setString(1, userId);
			rs = pstmt.executeQuery();
			while(rs.next()){
				CourseBean courseBean = new CourseBean();
				courseBean.setCourseId(rs.getString("course_id"));
				courseBean.setCourseName(rs.getString("course_name"));
				courseList.add(courseBean);
			}
		}
		catch(SQLException e){
			e.printStackTrace();
		}
		finally{
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return courseList;
	}
	
	/**
	 * Gets all the courses (course objects) according to a tutor id.
	 *
	 * @param userId 	  the id of a user (tutor)
	 * @return			  a list of course objects
	 * @throws     		  Exception
	 */
	public List<CourseBean> getCourseListForTutor(String userId) throws Exception{
		List<CourseBean> courseList = new ArrayList<CourseBean>();
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try{
			conn = getSourceLocator.ds.getConnection();
			String sql ="select distinct(c.course_id), c.course_name from course c, project p, `group` g where p.project_id = g.project_id and c.course_id = p.course_id and g.tutor_id = ?;";
			pstmt =conn.prepareStatement(sql);
			pstmt.setString(1, userId);
			rs = pstmt.executeQuery();
			while(rs.next()){
				CourseBean courseBean = new CourseBean();
				courseBean.setCourseId(rs.getString("course_id"));
				courseBean.setCourseName(rs.getString("course_name"));
				courseList.add(courseBean);
			}
		}
		catch(SQLException e){
			e.printStackTrace();
		}
		finally{
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return courseList;
	}
	
	/**
	 * Gets all the courses (course objects) according to a lecturer id.
	 *
	 * @param userId 	  the id of a user (lecturer)
	 * @return			  a list of course objects
	 * @throws     		  Exception
	 */
	public List<CourseBean> getCourseListForLecturer(String userId) throws Exception{
		List<CourseBean> courseList = new ArrayList<CourseBean>();
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try{
			conn = getSourceLocator.ds.getConnection();
			String sql ="select *  from course where lecturer_id = ?";
			pstmt =conn.prepareStatement(sql);
			pstmt.setString(1, userId);
			rs = pstmt.executeQuery();
			while(rs.next()){
				CourseBean courseBean = new CourseBean();
				courseBean.setCourseId(rs.getString("course_id"));
				courseBean.setCourseName(rs.getString("course_name"));
				courseList.add(courseBean);
			}
		}
		catch(SQLException e){
			e.printStackTrace();
		}
		finally{
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return courseList;
	}
	
	/**
	 * Gets all the projects according to a course id.
	 *
	 * @param courseId 	  the id of a course
	 * @return			  a list of project objects
	 * @throws     		  Exception
	 */
	public List<ProjectBean> getProjectList(String courseId) throws Exception{
		List<ProjectBean> projectList = new ArrayList<ProjectBean>();
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try{
			conn = getSourceLocator.ds.getConnection();
			String sql ="select * from project where course_id = ?;";
			pstmt =conn.prepareStatement(sql);
			pstmt.setString(1, courseId);
			rs = pstmt.executeQuery();
			while(rs.next()){
				ProjectBean projBean = new ProjectBean();
				projBean.setProjectDescription(rs.getString("project_description"));
				projBean.setProjectId(rs.getString("project_id"));
				projBean.setProjectName(rs.getString("project_name"));
				projectList.add(projBean);
			}
		}
		catch(SQLException e){
			e.printStackTrace();
		}
		finally{
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return projectList;
	}
	
	/**
	 * Creates a new group.
	 *
	 * @param projectId 	  the id of the project
	 * @param groupName 	  the name of the group
	 * @param tutorId 		  the id of the assigned tutor
	 * @return      		  the id of new created group
	 * @throws     			  IOException
	 */
	public String createGroup(String projectId,String groupName,String tutorId) throws Exception{
		String groupId =null;
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try{
			conn = getSourceLocator.ds.getConnection();
			String sql ="insert into `group` (group_name,project_id,tutor_id) values (?,?,?);";
			pstmt =conn.prepareStatement(sql);
			pstmt.setString(1, groupName);
			pstmt.setInt(2,Integer.parseInt(projectId));
			pstmt.setString(3,tutorId);
			pstmt.executeUpdate();
			conn.commit();
			String ssql = "SELECT max(group_id) FROM `group` g ";
			pstmt = conn.prepareStatement(ssql);
			rs = pstmt.executeQuery();
			if(rs.next()){
				groupId = rs.getString("max(group_id)");
			}
		}
		catch(SQLException e){
			conn.rollback();
			e.printStackTrace();
		}
		finally{
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return groupId;
	}
	
	/**
	 * Gets a course according to a project id.
	 *
	 * @param projectId   the id of a project
	 * @return			  a course object
	 * @throws     		  Exception
	 */
	public CourseBean getCourseByProject(String projectId) throws Exception{
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		CourseBean courseBean = null;
		try{
			conn = getSourceLocator.ds.getConnection();
			String sql ="select c.*  from project p,course c where p.project_id = ? and p.course_id = c.course_id ";
			pstmt =conn.prepareStatement(sql);
			pstmt.setInt(1,Integer.parseInt(projectId));
			rs = pstmt.executeQuery();
			if(rs.next()){
				courseBean = new CourseBean();
				courseBean.setCourseId(rs.getString("course_id"));
				courseBean.setCourseName(rs.getString("course_name"));
			}
		}
		catch(SQLException e){
			e.printStackTrace();
		}
		finally{
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return courseBean;
	}
	
	
	/**
	 * Gets all the groups according to a tutor id of a project id.
	 *
	 * @param accountId    the id of a tutor
	 * @param projectId    the id of a project
	 * @return			   a list of group objects
	 * @throws     		   Exception
	 */
	public List<GroupBean> getGroupsByTutor(String accountId,String projectId) throws Exception{
		List<GroupBean> groups = new ArrayList<GroupBean>();
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try{
			conn = getSourceLocator.ds.getConnection();
			String sql = "select g.group_id,g.group_name,g.tutor_id,p.name from `group` g,person p where g.project_id = ? and g.tutor_id = ? and g.tutor_id=p.person_Id";
			pstmt =conn.prepareStatement(sql);
			pstmt.setInt(1,Integer.parseInt(projectId));
			pstmt.setString(2, accountId);
			rs = pstmt.executeQuery();
			if(rs.next()){
				GroupBean groupBean = new GroupBean();
				groupBean.setGroupId(rs.getString("group_id"));
				groupBean.setGroupName(rs.getString("group_name"));
				UserBean userBean = new UserBean();
				userBean.setAccountId(rs.getString("tutor_id"));
				userBean.setUserName(rs.getString("name"));
				groupBean.setTutor(userBean);
				groupBean.setMembers(this.getGroupMembers(groupBean.getGroupId()));
				groups.add(groupBean);
			}
		}
		catch(SQLException e){
			e.printStackTrace();
			throw e;
		}
		finally{
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return groups;
	}
	
	/**
	 * Gets all the groups according to a lecturer id of a project id.
	 *
	 * @param accountId    the id of a lecturer
	 * @param projectId    the id of a project
	 * @return			   a list of group objects
	 * @throws     		   Exception
	 */
	public List<GroupBean> getGroupsByLecturer(String accountId,String projectId) throws Exception{
		List<GroupBean> groups = new ArrayList<GroupBean>();
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try{
			conn = getSourceLocator.ds.getConnection();
			String sql ="select g.group_id, g.group_name, g.tutor_id, pe.name from `group` g, project p,course c,person pe where g.project_id = ? and g.project_Id = p.project_id and p.course_id = c.course_id and c.lecturer_id = ? and g.tutor_id = pe.person_id";
			pstmt =conn.prepareStatement(sql);
			pstmt.setInt(1,Integer.parseInt(projectId));
			pstmt.setString(2, accountId);
			rs = pstmt.executeQuery();
			while(rs.next()){
				GroupBean groupBean = new GroupBean();
				groupBean.setGroupId(rs.getString("group_id"));
				groupBean.setGroupName(rs.getString("group_name"));
				UserBean userBean = new UserBean();
				userBean.setAccountId(rs.getString("tutor_id"));
				userBean.setUserName(rs.getString("name"));
				groupBean.setTutor(userBean);
				groupBean.setMembers(this.getGroupMembers(groupBean.getGroupId()));
				groups.add(groupBean);
			}
		}
		catch(SQLException e){
			e.printStackTrace();
			throw e;
		}
		finally{
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return groups;
	}
	
	/**
	 * Gets all the groups according to a student id of a project id.
	 *
	 * @param accountId    the id of a student
	 * @param projectId    the id of a project
	 * @return			   a list of group objects
	 * @throws     		   Exception
	 */
	public List<GroupBean> getGroupsByStudent(String accountId,String projectId) throws Exception{
		List<GroupBean> groups = new ArrayList<GroupBean>();
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try{
			conn = getSourceLocator.ds.getConnection();
			String sql ="SELECT g.group_id, g.group_name, g.tutor_id, p.name FROM `group` g, enrollgroup e, person p where g.project_id = ? and e.group_id = g.group_id and e.student_id = ? and g.tutor_id=p.person_Id;";
			pstmt =conn.prepareStatement(sql);
			pstmt.setInt(1,Integer.parseInt(projectId));
			pstmt.setString(2, accountId);
			rs = pstmt.executeQuery();
			if(rs.next()){
				GroupBean groupBean = new GroupBean();
				groupBean.setGroupId(rs.getString("group_id"));
				groupBean.setGroupName(rs.getString("group_name"));
				UserBean userBean = new UserBean();
				userBean.setAccountId(rs.getString("tutor_id"));
				userBean.setUserName(rs.getString("name"));
				groupBean.setTutor(userBean);
				groupBean.setMembers(this.getGroupMembers(groupBean.getGroupId()));
				groups.add(groupBean);
			}
		}
		catch(SQLException e){
			e.printStackTrace();
		}
		finally{
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return groups;
	}
	
	/**
	 * Modifies a group. The group members or the tutor assigned to the group could be changed in this stage. And checks whether the operation is successful.
	 *
	 * @param accountIds   the ids of students that will be in one group
	 * @param projectId    the id of a project
	 * @param groupName	   the name of the group
	 * @param tutorId	   the id of the tutor assigned to the group
	 * @return			   success or failure
	 * @throws     		   Exception
	 */
	public boolean modifyGroup(List<String> accountIds, String groupId,String groupName,String tutorId)throws Exception {
		Connection conn = null;
		PreparedStatement pstmt = null;
		boolean success = false;
		try{
			conn = getSourceLocator.ds.getConnection();
			try{
			String sql ="delete from enrollgroup where group_id = ?;";
			pstmt =conn.prepareStatement(sql);
			pstmt.setInt(1,Integer.parseInt(groupId));
			pstmt.executeUpdate();
			conn.commit();
			}
			catch(Exception e){
				throw new Exception("unknown group_Id");
			}
			String updateSql = "update `group` set group_name = ?, tutor_id = ? where group_id = ?";
			pstmt = conn.prepareStatement(updateSql);
			pstmt.setString(1,groupName);
			pstmt.setString(2, tutorId);
			pstmt.setInt(3, Integer.parseInt(groupId));
			pstmt.executeUpdate();
			this.assignGroup(accountIds, groupId);
			success = true;
		}
		catch(SQLException e){
			conn.rollback();
			e.printStackTrace();
			throw e;
		}
		finally{
			if (conn != null && pstmt != null) {
				conn.commit();
				conn.close();
				pstmt.close();
			}
		}
		return success;
	}

}
