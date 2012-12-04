package com.rest;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;
import com.bean.CourseBean;
import com.bean.GroupBean;
import com.bean.ProjectBean;
import com.service.GroupService;
import com.service.UserService;



@Path("/group")
public class GroupRest {

	@Context
	UriInfo uriInfo;
	@Context
	Request request;

	/**
	 * Gets a list of courses corresponding to a user.
	 *
	 * @param accountId  the id of the current user
	 * @param token		 the token provided by the user
	 * @return           response
	 * @throws Exception
	 */
	@GET
	@Path("{accountId}/{token}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response getCoursesByaccountId(@PathParam("accountId") String account_id, @PathParam("token") String token) throws Exception {
		GroupService gs = new GroupService();		
		UserService us = new UserService();
		String role = null;
		Response  response = null;
		try {
			role = us.checkAuth(account_id, token);
			List<CourseBean> courses = gs.getCoursesList(account_id, role);
			JSONArray ja = new JSONArray();
			for (int i = 0; i < courses.size(); i++) {
				JSONObject jo = new JSONObject();
				jo.put("courseId", courses.get(i).getCourseId());
				jo.put("courseName", courses.get(i).getCourseName());
				ja.put(jo);
			}
			response = Response.ok(ja).build();
		} catch (Exception e) {
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}


	/**
	 * Gets a list of projects in a course corresponding to a user.
	 *
	 * @param accountId  the id of the current user
	 * @param token		 the token provided by the user
	 * @param courseId   the id of a course
	 * @return           response
	 * @throws Exception
	 */
	@GET
	@Path("{accountId}/{token}/{courseId}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response getProjectsBycourseId(@PathParam("accountId") String account_id, @PathParam("token") String token, @PathParam("courseId") String course_Id) throws Exception {
		GroupService gs = new GroupService();		
		UserService us = new UserService();
		Response response =null;
		String role = null;
		try {
			role = us.checkAuth(account_id, token);
			List<CourseBean> courses = gs.getCoursesList(account_id, role);
			boolean hasCourse = false;
			for(int i = 0; i<courses.size();i++){
				if(courses.get(i).getCourseId().equals(course_Id))
					hasCourse = true;
			}
			if(!hasCourse)
				throw new Exception("invalid");
			List<ProjectBean> projects = gs.getProjectList(course_Id);
			JSONArray ja = new JSONArray();
			for (int i = 0; i < projects.size(); i++) {
				JSONObject jo = new JSONObject();
				jo.put("projectId", projects.get(i).getProjectId());
				jo.put("projectName", projects.get(i).getProjectName());
				jo.put("projectDescription", projects.get(i)
						.getProjectDescription());
				ja.put(jo);
			}
			response = Response.ok(ja).build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}


	/**
	 * Gets a list of groups in one project corresponding to a user.
	 *
	 * @param accountId  the id of the current user
	 * @param token		 the token provided by the user
	 * @param courseId   the id of a course
	 * @param projectId  the id of a project
	 * @return           response
	 * @throws Exception
	 */
	@GET
	@Path("{accountId}/{token}/{courseId}/{projectId}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response getGroupList(@PathParam("accountId") String accountId, @PathParam("token") String token,  @PathParam("courseId") String courseId,@PathParam("projectId") String projectId) throws Exception {
		GroupService gs = new GroupService();		
		UserService us = new UserService();
		Response response;
		try {
			String role = us.checkAuth(accountId, token);
			List<CourseBean> courses = gs.getCoursesList(accountId, role);
			boolean hasCourse = false;
			for(int i = 0; i<courses.size();i++){
				if(courses.get(i).getCourseId().equals(courseId))
					hasCourse = true;
			}
			if(!hasCourse)
				throw new Exception("invalid");
			List<ProjectBean> projectBeans = gs.getProjectList(courseId);
			boolean hasProject = false;
			for(int i = 0; i<projectBeans.size();i++){
				if(projectBeans.get(i).getProjectId().equals(projectId))
					hasProject = true;
			}
			if(!hasProject)
				throw new Exception("invalid");
			List<GroupBean> gList = gs.listGroup(projectId, accountId, role);
			JSONArray ja = new JSONArray();
			for (int i = 0; i < gList.size(); i++) {
				JSONObject jo = new JSONObject();
				jo.put("groupId", gList.get(i).getGroupId());
				jo.put("groupName", gList.get(i).getGroupName());
				jo.put("tutorId", gList.get(i).getTutor().getAccountId());
				jo.put("tutorName", gList.get(i).getTutor().getUserName());
				JSONArray jsonArray = new JSONArray();
				for(int j =0;j< gList.get(i).getMembers().size();j++){
					JSONObject jsonObject = new JSONObject();
					jsonObject.put("memberName",gList.get(i).getMembers().get(j).getUserName());
					jsonObject.put("memberId",gList.get(i).getMembers().get(j).getAccountId());
					jsonArray.put(jsonObject);
				}
				jo.put("members", jsonArray);
				ja.put(jo);
			}
			response = Response.ok(ja).build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}


	/**
	 * Gets a specific group.
	 *
	 * @param account_id  the id of the current user
	 * @param token		  the token provided by the user
	 * @param course_Id   the id of a course
	 * @param project_Id  the id of a project
	 * @param group_Id    the id of a group
	 * @return            response
	 * @throws Exception
	 */
	@GET
	@Path("{accountId}/{token}/{courseId}/{projectId}/{groupId}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response getGroup(@PathParam("accountId") String account_id, @PathParam("token") String token,  @PathParam("courseId") String course_Id,@PathParam("projectId") String project_Id, @PathParam("groupId") String group_Id) throws Exception {
		GroupService gs = new GroupService();		
		UserService us = new UserService();
		Response response = null;
		try {
			String role = us.checkAuth(account_id, token);
			String repo = gs.viewRepository(group_Id);
			JSONObject jo = new JSONObject();
			jo.put("repoName", repo);
			response = Response.ok(jo).build();
		} catch (Exception e) {
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}



	/**
	 * Creates a new group.
	 *
	 * @param account_id  the id of the current user
	 * @param token		  the token provided by the user
	 * @param course_Id   the id of a course
	 * @param project_Id  the id of a project
	 * @param groupInfo   a group object with parameters "groupName", "tutorId" and member list "memberIds" encapsulated in a JSON object
	 * @return            response
	 * @throws Exception
	 */
	@POST
	@Path("{accountId}/{token}/{courseId}/{projectId}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response createGroup( @PathParam("accountId") String account_Id, @PathParam("token") String token,
			@PathParam("courseId") String course_Id,@PathParam("projectId") String project_Id,
			JSONObject groupInfo
			) throws Exception {

		GroupService gs = new GroupService();
		UserService us = new UserService();
		String role = null;
		Response response = null;
		try {
			role = us.checkAuth(account_Id, token);
			String group_Name = groupInfo.getString("groupName");
			String tutor_Id = groupInfo.getString("tutorId");

			List<String> mates = new ArrayList<String>();
			JSONArray accountNameArray = groupInfo.getJSONArray("memberIds");
			for (int i = 0; i < accountNameArray.length(); i++) {
				JSONObject temp = accountNameArray.getJSONObject(i);
				mates.add(temp.getString("memberId"));
			}
			if (!role.equals("lecturer"))
				throw new Exception("invalid");
			String newRepo = gs.createGroup(project_Id, group_Name, tutor_Id,mates);
			URI uri = uriInfo.getAbsolutePathBuilder().path(newRepo).build();
			response = Response.created(uri).build();
		} catch (Exception e) {
			if (e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;

	}

	/**
	 * Modifies an existed group
	 *
	 * @param account_id    the id of the current user
	 * @param token		    the token provided by the user
	 * @param course_Id     the id of a course
	 * @param project_Id    the id of a project
	 * @param groupId       the id of the existed group object
	 * @param newGroupInfo  a new (modified) group object with parameters "groupName", "tutorId" and member list "memberIds" encapsulated in a JSON object
	 * @return              response
	 * @throws Exception
	 */
	@PUT
	@Path("{accountId}/{token}/{courseId}/{projectId}/{groupId}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response modifyGroup( @PathParam("accountId") String account_Id, @PathParam("token") String token,
			@PathParam("courseId") String course_Id,@PathParam("projectId") String project_Id,@PathParam("groupId")
			String groupId, JSONObject newGroupInfo) throws Exception  {
		GroupService groupService = new GroupService();
		UserService us = new UserService();
		Response response = null;
		String role="";
		
		try {
			role = us.checkAuth(account_Id, token);
			if (!role.equals("lecturer"))
				throw new Exception("invalid");
			String groupName = newGroupInfo.getString("groupName");
			String tutorId = newGroupInfo.getString("tutorId");

			List<String> accountIds = new ArrayList<String>();
			JSONArray accountNameArray = newGroupInfo.getJSONArray("memberIds");
			for (int i = 0; i < accountNameArray.length(); i++) {
				JSONObject temp = accountNameArray.getJSONObject(i);
				accountIds.add(temp.getString("memberId"));
			}
			groupService.modifyGroup(groupId, accountIds,groupName,tutorId);
			response = Response.ok().build();
		}
		catch (Exception e){
			if (e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if(e.getMessage().equals("unknown group_Id"))
				response = Response.status(Response.Status.CONFLICT).build();
			else
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}



}
