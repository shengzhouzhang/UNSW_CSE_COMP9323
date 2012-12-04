package com.service;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import org.eclipse.egit.github.core.Repository;
import org.eclipse.egit.github.core.RepositoryBranch;

import com.bean.CourseBean;
import com.bean.DirListBean;
import com.bean.GroupBean;
import com.bean.ProjectBean;
import com.bean.UserBean;
import com.dao.GroupDao;
import com.dao.RepoDao;
import com.dao.UserDao;
import com.github.Repo;

public class GroupService {


//	@Override
//	public List<UserBean> getGroupMates(String accountId,String projectId) throws Exception {
//		GroupDao groupDao = new GroupDao();
//		List<UserBean> groupMates = null;
//		try{
//			groupMates =  groupDao.getGroupMember(accountId,projectId);
//		}
//		catch(Exception e){
//			throw new Exception("internal error!");
//		}
//		return groupMates;
//	}
	
	/**
	 * Gets a list of courses.
	 *
	 * @param accountId  the id of the current user
	 * @param role       the role of the current user
	 * @return           a list of courses
	 * @throws Exception
	 */
	public List<CourseBean> getCoursesList(String accountId,String role) throws Exception {
		GroupDao groupDao = new GroupDao();
		List<CourseBean> courseList = null;
		try{
			if(role.equals("student"))
				courseList =  groupDao.getCourseListForStudent(accountId);
			else if(role.equals("tutor"))
				courseList = groupDao.getCourseListForTutor(accountId);
			else if(role.equals("lecturer"))
				courseList = groupDao.getCourseListForLecturer(accountId);
		}
		catch(Exception e){
			throw new Exception("internal error!");
		}
		return courseList;
	}

	/**
	 * Gets a list of project objects.
	 *
	 * @param courseId  the id of a course
	 * @return          a list of project objects
	 * @throws Exception
	 */
	public List<ProjectBean> getProjectList(String courseId)
			throws Exception {
		GroupDao groupDao = new GroupDao();
		List<ProjectBean> projectList = null;
		try{
			projectList =  groupDao.getProjectList(courseId);
		}
		catch(Exception e){
			throw new Exception("internal error!");
		}
		return projectList;
	}

	/**
	 * Creates a new group.
	 *
	 * @param projectId  the id of a project
	 * @param groupName  the id of a group
	 * @param tutorId    the id of a tutor
	 * @param accountIds the ids of all group members
	 * @return           a id of a group
	 * @throws Exception
	 */
	public String createGroup(String projectId,String groupName,String tutorId,List<String> accountIds) throws Exception {
		GroupDao groupDao = new GroupDao();
		String groupId = null;
		String newRepo = null;
		//List<String> projectList = null;
		try{
			groupId =  groupDao.createGroup(projectId, groupName, tutorId);
			groupDao.assignGroup(accountIds, groupId);

			CourseBean courseBean = groupDao.getCourseByProject(projectId);
			newRepo = courseBean.getCourseId()+projectId+groupId;

			Repo  repo = new Repo();
			repo.createRepo(newRepo, newRepo);
			RepoDao repoDao= new RepoDao();
			repoDao.createRepo(newRepo, groupId);
		}
		catch(Exception e){
			e.printStackTrace();
			throw new Exception("internal error!");
		}
		return groupId;
	}

	/**
	 * Gets a list of group objects.
	 *
	 * @param projectId  the id of a project
	 * @param accountId  the account id of a user
	 * @param role       the role of the user
	 * @return           a list of group objects
	 * @throws Exception
	 */
	
	public List<GroupBean> listGroup(String projectId, String accountId,
			String role)throws Exception {
		GroupDao groupDao = new GroupDao();
		List<GroupBean> groupList = null;
		if(role.equals("tutor")){
			groupList = groupDao.getGroupsByTutor(accountId, projectId);
		}
		else if(role.equals("lecturer")){
			groupList = groupDao.getGroupsByLecturer(accountId,projectId);
		}
		else if(role.equals("student")){
			groupList = groupDao.getGroupsByStudent(accountId, projectId);
		}
		return groupList;
	}
	
	
	/**
	 * Modifies an existed group
	 *
	 * @param groupId     the id of a group
	 * @param accountIds  the account ids of all group members
	 * @param groupName   the id of a group
	 * @param tutorId     the id of a tutor
	 * @throws Exception
	 */
	
	public void modifyGroup(String groupId, List<String> accountIds,String groupName,String tutorId)throws Exception {
		try{
			UserDao userDao = new UserDao();
			Hashtable<String, Integer> idSet = new Hashtable<String, Integer>();
			for (int i = 0; i < accountIds.size(); i++) {
				if(idSet.get(accountIds)==null){
					idSet.put(accountIds.get(i), 1);
					if(!userDao.checkExistingAccount(accountIds.get(i)))
						throw new Exception("Invalid Id");
				}
				else 
					throw new Exception("Duplicate Id");
			}
			GroupDao groupDao = new GroupDao();
			groupDao.modifyGroup(accountIds, groupId,groupName,tutorId);
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
	}
	
	/**
	 * Gets name of the repo.
	 *
	 * @param groupId  the id of a group
	 * @return         a name of the repo
	 * @throws Exception
	 */
	public String viewRepository(String groupId)
			throws Exception {
		RepoDao repoDao = new RepoDao();
		String repoName  = null;
		try{
			repoName = repoDao.getRepoByGroupId(groupId);
		}
		catch(Exception e){
			e.printStackTrace();
			throw new Exception("internal error!");
		}
		return repoName;
	}

}
