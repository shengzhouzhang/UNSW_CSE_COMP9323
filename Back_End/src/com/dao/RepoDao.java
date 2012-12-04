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
import java.util.List;

import com.jndiLocator.getSourceLocator;

public class RepoDao {
	
	/**
	 * Creates a new repository.
	 *
	 * @param repoName     the name of the new repository
	 * @param groupId	   the id of the group
	 * @throws     		   Exception
	 */
	public void createRepo(String repoName, String groupId) throws Exception {
		Connection conn = null;
		PreparedStatement pstmt = null;
		try {
			conn = getSourceLocator.ds.getConnection();
			String sql = "insert into resource (resource_id,group_id) values (?,?);";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, repoName);
			pstmt.setInt(2, Integer.parseInt(groupId));
			pstmt.executeUpdate();
			conn.commit();
		} catch (Exception e) {
			conn.rollback();
			throw new Exception("internal error!");
		} finally {
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
	}
	
	/**
	 * Gets a repository name according to the group id.
	 *
	 * @param groupId	   the id of the group
	 * @return			   the name of the repository
	 * @throws     		   Exception
	 */
	public String getRepoByGroupId(String groupId) throws Exception {
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String repoName = null;
		try {
			conn = getSourceLocator.ds.getConnection();
			String sql = "select resource_id from resource where group_id = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, Integer.parseInt(groupId));
			rs = pstmt.executeQuery();
			if(rs.next()){
				repoName = rs.getString("resource_id");
			}
		} catch (Exception e) {
			e.printStackTrace();
			conn.rollback();
			throw new Exception("internal error!");
		} finally {
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return repoName;
	}
	
	/**
	 * Checks whether a student holding the permission of accessing a repository.
	 *
	 * @param repoName     the name of the repository
	 * @param userId	   the id of a student
	 * @return    		   success or failure
	 * @throws     		   Exception
	 */
	public Boolean checkPermissionOfStudent(String repoName,String userId) throws Exception {
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		Boolean success = false;
		try {
			conn = getSourceLocator.ds.getConnection();
			String sql = "SELECT * FROM resource r, `group` g, enrollgroup e where r.resource_id = ? and r.group_id = g.group_id and e.group_id = g.group_id and e.student_id = ?;";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, repoName);
			pstmt.setString(2, userId);
			rs = pstmt.executeQuery();
			if(rs.next()){
				success = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
			conn.rollback();
			throw new Exception("internal error!");
		} finally {
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return success;
	}
	
	/**
	 * Checks whether a tutor holding the permission of accessing a repository.
	 *
	 * @param repoName     the name of the repository
	 * @param userId	   the id of a tutor
	 * @return    		   success or failure
	 * @throws     		   Exception
	 */
	public Boolean checkPermissionOfTutor(String repoName,String userId) throws Exception {
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		Boolean success = false;
		try {
			conn = getSourceLocator.ds.getConnection();
			String sql = "SELECT * FROM resource r, `group` g where r.resource_id = ? and r.group_id = g.group_id and g.tutor_id = ?;";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, repoName);
			pstmt.setString(2, userId);
			rs = pstmt.executeQuery();
			if(rs.next()){
				success = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
			conn.rollback();
			throw new Exception("internal error!");
		} finally {
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return success;
	}
	
	/**
	 * Checks whether a lecturer holding the permission of accessing a repository.
	 *
	 * @param repoName     the name of the repository
	 * @param userId	   the id of a lecturer
	 * @return    		   success or failure
	 * @throws     		   Exception
	 */
	public Boolean checkPermissionOfLecturer(String repoName,String userId) throws Exception {
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		Boolean success = false;
		try {
			conn = getSourceLocator.ds.getConnection();
			String sql = "SELECT * FROM resource r, `group` g, project p,course c where r.resource_id = ? and r.group_id = g.group_id and g.project_id= p.project_id and p.course_id = c.course_id and c.lecturer_id = ?;";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, repoName);
			pstmt.setString(2, userId);
			rs = pstmt.executeQuery();
			if(rs.next()){
				success = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
			conn.rollback();
			throw new Exception("internal error!");
		} finally {
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return success;
	}
	
	/**
	 * Checks whether a log all operations (commit, revert, delete) on a specific repository is successfully recorded.
	 *
	 * @param repoName     the name of the repository
	 * @param userId	   the id of a user
	 * @return    		   success or failure
	 * @throws     		   Exception
	 */
	public Boolean OperationLog(String repoName,String userId) throws Exception {
		Connection conn = null;
		PreparedStatement pstmt = null;
		//ResultSet rs = null;
		Boolean success = false;
		try {
			conn = getSourceLocator.ds.getConnection();
			String sql = "insert into operation_log (operation_time,operater_id, operation_type, repo_name) values(current_timestamp, ?, 'commit',?);";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, userId);
			pstmt.setString(2, repoName);
			pstmt.executeUpdate();
			
				success = true;
			
		} catch (Exception e) {
			e.printStackTrace();
			conn.rollback();
			throw new Exception("internal error!");
		} finally {
			if (conn != null && pstmt != null) {
				conn.close();
				pstmt.close();
			}
		}
		return success;
	}
}
