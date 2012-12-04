package com.rest;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.JAXBElement;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import com.bean.UserBean;
import com.google.gson.JsonArray;

@Path("/user")
public class UserRest {
	@Context
	UriInfo uriInfo;
	@Context
	Request request;

	/**
	 * User login.
	 *
	 * @param user 		 a user object with "username" and "password" encapsulated in a JSON object
	 * @return           response
	 * @throws Exception
	 */
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response userLogin(JSONObject user){
		com.service.UserService userService = new com.service.UserService();
		UserBean userBean = new UserBean();
		Response response = null;
		try {
			userBean = userService.login(user.getString("username").toString(), user.getString("password").toString());
			JSONObject jo = new JSONObject();
			jo.put("token", userBean.getToken());
			jo.put("role", userBean.getRole());
			response = Response.ok(jo).build();
		}
		catch (Exception e){
			if (e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.UNAUTHORIZED).build();
			else
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}

	/**
	 * User registration.
	 *
	 * @param user 		 a user object with parameters "accountId", "password", "username", and "role" encapsulated in a JSON object
	 * @return           response
	 * @throws Exception
	 */
	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response userRegister(JSONObject user){
		com.service.UserService userService = new com.service.UserService();
		Response response = null;
		try {
			String accountId = user.getString("accountId");
			String pwd = user.getString("password");
			String userName = user.getString("username");
			String role = user.getString("role");
			userService.register(accountId, pwd, userName, role);
			response = Response.ok("success").build();
		}
		catch (Exception e){
			if (e.getMessage().equals("person Exist"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}

	/**
	 * List unsigned students according to project.
	 *
	 * @param accountId 	the id of the current user
	 * @param projectId     the id of a project
	 * @return              response
	 * @throws Exception
	 */
	@POST
	@Path("/getUnsignedStudentListByProject/{accountId}/{projectId}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getUnsignedStudentListByProject(@PathParam("accountId") String accountId,@PathParam("projectId") String projectId){
		com.service.UserService userService = new com.service.UserService();
		Response response = null;
		List<UserBean> userBeans;
		try {
			userBeans = userService.getUnsginedStudentByProject(accountId, projectId);
			JSONArray jArray = new JSONArray();
			for(int i = 0; i<userBeans.size();i++){
				JSONObject jObject = new JSONObject();
				jObject.put("studentId", userBeans.get(i).getAccountId());
				jObject.put("name", userBeans.get(i).getUserName());
				jArray.put(jObject);
				}
			response = Response.ok(jArray.toString()).build();
		}
		catch (Exception e){
			if (e.getMessage().equals("permision denied"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}

}
