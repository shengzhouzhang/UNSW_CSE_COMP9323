package com.rest;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import javax.ws.rs.Path;
import java.net.URI;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
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
import org.eclipse.egit.github.core.Repository;

import com.bean.CommentBean;
import com.bean.DirListBean;
import com.bean.ProjectBean;
import com.service.CommentService;
import com.service.GroupService;
import com.service.UserService;



@Path("/comment")
public class CommentRest {

	@Context
	UriInfo uriInfo;
	@Context
	Request request;
	
	
	/**
	 * Gets a list of comment objects.
	 *
	 * @param account_id    the id of the current user
	 * @param token		    the token provided by the user
	 * @param repo          the name of the target repository
	 * @param sha           an id string of the comments
	 * @return              response
	 * @throws Exception
	 */
	@GET
	@Path("{accountId}/{token}/{repo}/{sha}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response viewComment(@PathParam("accountId") String account_id,
			@PathParam("token") String token, @PathParam("repo") String repo,
			@PathParam("sha") String sha)
			throws Exception {
		CommentService cs = new CommentService();
		UserService us = new UserService();
		Response response = null;
		String role = "";
		try {
			role = us.checkAuth(account_id, token);
			List<CommentBean> cb = cs.viewComment(account_id, repo, sha);

			JSONArray ja = new JSONArray();
			for (int i = 0; i < cb.size(); i++) {
				JSONObject jo = new JSONObject();
				jo.put("commentPath", cb.get(i).getPath());
				jo.put("commiterId", cb.get(i).getCommenterId());
				jo.put("commentContent", cb.get(i).getCommentContent());
				jo.put("commentPosition", cb.get(i).getPosition());
				jo.put("commentDate", cb.get(i).getCreatedAt()); //java.util.Date object
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
	 * Adds a comment.
	 *
	 * @param account_id    the id of the current user
	 * @param token		    the token provided by the user
	 * @param repoName      the name of the target repository
	 * @param branchName    the branch name
	 * @param sha           an id string of the comments
	 * @param commentInfo   a comment object with parameters "commentContent", "commenterId", "commentPosition" and "commentPath" encapsulated in a JSON object
	 * @return              response
	 * @throws Exception
	 */
		@POST
		@Path("{accountId}/{token}/{repo}/{branchName}/{sha}")
		@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
		//@Produces(MediaType.TEXT_HTML)
		//@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public Response addComment(@PathParam("accountId") String account_Id,
			@PathParam("token") String token,@PathParam("repo") String repoName,
			@PathParam("branchName") String branchName, @PathParam("sha") String sha, JSONObject commentInfo) throws Exception {
		CommentService cs = new CommentService();
		UserService us = new UserService();
		Response response = null;
		String role = "";
		try {
			role = us.checkAuth(account_Id, token);
			CommentBean commentBean = new CommentBean();
			commentBean.setCommentContent(commentInfo.getString("commentContent"));
			commentBean.setCommenterId(commentInfo.getString("commenterId"));
			commentBean.setPosition(Integer.parseInt(commentInfo.getString("commentPosition")));
			commentBean.setPath(commentInfo.getString("commentPath"));
			cs.addComment(commentBean, repoName, sha);
			String id = commentBean.getCommenterId();
			URI uri = uriInfo.getAbsolutePathBuilder().build();
			response = Response.created(uri).build();
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception(e.getMessage());
		}
		return response;
	}
	
	

}
