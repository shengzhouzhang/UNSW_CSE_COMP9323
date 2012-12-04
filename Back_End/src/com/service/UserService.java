package com.service;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import java.util.List;

import com.bean.UserBean;
import com.dao.GroupDao;
import com.dao.RepoDao;
import com.dao.UserDao;
import com.google.gson.JsonObject;

public class UserService{

	/**
	 * User login.
	 *
	 * @param accountId  the id of the current user
	 * @param password   the password of the current user
	 * @return           a user object
	 * @throws Exception
	 */
	public UserBean login(String accountId, String password)
			throws Exception {
		///JsonObject json = new JsonObject();
		UserDao userDao = new UserDao();
		UserBean userBean = new UserBean();
		try{
			userBean = userDao.login(accountId, password);
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				throw e;
			else
				throw new Exception("internal error!");
		}
		return userBean;
	}

	/**
	 * Checks the role of the current user.
	 *
	 * @param accountId  the id of the current user
	 * @param token      the token corresponding to the current user
	 * @return           role of the user
	 * @throws Exception
	 */
	public String checkAuth(String accountId, String token) throws Exception {
		String role = "";
		UserDao userDao = new UserDao();
		try{
			Boolean success = userDao.getAuth(accountId, token);
			if(success){
				role = userDao.getUserRole(accountId);
			}
		}
		catch (Exception e){
			e.printStackTrace();
			if(e.getMessage().equals("invalid"))
				throw e;
			else	
				throw new Exception("internal error!");
		}
		return role;
	}

	/**
	 * Checks the permission with the user role.
	 *
	 * @param accountId  the id of the current user
	 * @param repoName   the name of the target repo
	 * @param role       the role corresponding to the current user
	 * @throws Exception
	 */
	public void checkPermision(String accountId, String repoName,String role)
			throws Exception {
		RepoDao repoDao = new RepoDao();
		boolean success = false;
		try {
			if (role.equals("student")) {
				success = repoDao.checkPermissionOfStudent(repoName, accountId);
			} else if (role.equals("lecturer")) {
				success = repoDao.checkPermissionOfLecturer(repoName, accountId);
			} else if (role.equals("tutor")) {
				success = repoDao.checkPermissionOfTutor(repoName, accountId);
			}
		}
		catch(Exception e){
			e.printStackTrace();
			throw new Exception("internal error");
		}
		if(!success){
			throw new Exception("permision denied");
		}
	}

	/**
	 * Registration - adds a new user.
	 *
	 * @param accountId  the id of the new user
	 * @param password   the password of the new user
	 * @param userName   the name of the new user
	 * @param role       the role of the new user
	 * @throws Exception
	 */
	public void register(String accountId, String password, String userName,
			String role) throws Exception {
		UserDao userDao = new UserDao();
		try {
			if(userDao.checkExistingAccount(accountId))
				throw new Exception("person Exist");
			userDao.registerUser(accountId, userName, password, role);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		
	}
	
	/**
	 * List unsigned students according to project.
	 *
	 * @param accountId 	the id of the current user
	 * @param projectId     the id of a project
	 * @return              list of user beans
	 * @throws Exception
	 */
	public List<UserBean> getUnsginedStudentByProject(String accountId,String projectId)throws Exception{
		List<UserBean> userBeans;
		UserDao userDao = new UserDao();
		if(!userDao.checkLecturerAuth(accountId, projectId))
			throw new Exception("permision denied");
		userBeans = userDao.getUnsignedStudentsByProject(projectId);
		return userBeans;
	}
	
	
}
