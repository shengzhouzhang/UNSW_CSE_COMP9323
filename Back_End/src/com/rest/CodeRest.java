package com.rest;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import java.util.ArrayList;
import java.util.List;

import javax.swing.Box.Filler;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
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

import com.bean.DirListBean;
import com.bean.FileBean;
import com.bean.VersionBean;
import com.service.CodeService;
import com.service.GroupService;
import com.service.UserService;

@Path("/repo")
public class CodeRest {
	@Context
	UriInfo uriInfo;
	@Context
	Request request;

	/**
	 * Gets a list of branches.
	 *
	 * @param accountId  the id of the user
	 * @param repoName   the name of the target repo
	 * @param token		 the token provided by the user
	 * @return           response
	 * @throws Exception
	 */
	@GET
	@Path("{accountId}/{token}/{repoName}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response viewBranches(@PathParam("accountId") String accountId, @PathParam("repoName") String repoName, @PathParam("token") String token) throws Exception {
		CodeService cs = new CodeService();
		UserService us = new UserService();
		Response response = null;
		String role="";
		try {
			role = us.checkAuth(accountId, token);
			us.checkPermision(accountId, repoName, role);
			List<String> bList = new ArrayList<String>();
			bList = cs.viewBranches(repoName);
			JSONArray ja = new JSONArray();
			for (int i=0; i<bList.size(); i++) {
				JSONObject jo = new JSONObject();
				jo.put("branchId", bList.get(i));
				ja.put(jo);
			}
			response = Response.ok(ja.toString()).build();
		}
		catch (Exception e){
			if(e.getMessage().equals("permision denied") || e.getMessage().equals("Invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if (e.getMessage().equals("not found"))
				response = Response.status(Response.Status.NOT_FOUND).build();
			else
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}

	
	/**
	 * Creates a branch
	 *
	 * @param branch     the branch object with parameter "branchName" encapsulated in a JSON object
	 * @param accountId  the id of the user
	 * @param repoName   the name of the target repo
	 * @param token		 the token provided by the user
	 * @return           response
	 * @throws Exception
	 */
	@POST
	@Path("{accountId}/{token}/{repoName}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response createBranch(JSONObject branch, @PathParam("accountId") String accountId, @PathParam("repoName") String repoName, @PathParam("token") String token) throws Exception {
		CodeService cs = new CodeService();
		UserService us = new UserService();
		Response response = null;
		String role="";
		try {
			role = us.checkAuth(accountId, token);
			us.checkPermision(accountId, repoName, role);
			String branchName = branch.getString("branchName");
			cs.createBrach(repoName, branchName, accountId);
			response = Response.ok("success").build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if (e.getMessage().equals("not found"))
				response = Response.status(Response.Status.NOT_FOUND).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}

	/**
	 * Deletes a branch
	 *
	 * @param branchName the branch name
	 * @param accountId  the id of the user
	 * @param repoName   the name of the target repo
	 * @param token		 the token provided by the user
	 * @return           response
	 * @throws Exception
	 */
	@DELETE
	@Path("{accountId}/{token}/{repoName}/branch={branchName}")
	public Response deleteBranch(@PathParam("branchName") String branchName, @PathParam("accountId") String accountId, @PathParam("repoName") String repoName, @PathParam("token") String token) throws Exception {
		CodeService cs = new CodeService();
		UserService us = new UserService();
		Response response = null;
		String role="";
		try {
			role = us.checkAuth(accountId, token);
			us.checkPermision(accountId, repoName, role);
			cs.deleteBrach(repoName, branchName, accountId);
			response = Response.ok("success").build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if (e.getMessage().equals("not found"))
				response = Response.status(Response.Status.NOT_FOUND).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}

	/**
	 * Gets a list of files of one commission
	 *
	 * @param commitSHA  the id of the commission
	 * @param accountId  the id of the user
	 * @param repoName   the name of the target repo
	 * @param token		 the token provided by the user
	 * @return 			 response
	 * @throws Exception
	 */
	@GET
	@Path("{accountId}/{token}/{repoName}/commitSHA={commitSHA}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response viewCommitFiles(@PathParam("commitSHA") String commitSHA, @PathParam("accountId") String accountId, @PathParam("repoName") String repoName, @PathParam("token") String token) throws Exception {
		CodeService cs = new CodeService();
		UserService us = new UserService();
		Response response = null;
		String role="";
		try {
			role = us.checkAuth(accountId, token);
			us.checkPermision(accountId, repoName, role);
			List<FileBean> fileList = cs.viewCommitFile(repoName, commitSHA);
			JSONArray ja = new JSONArray();
			for (int i=0; i<fileList.size(); i++) {
				JSONObject jo = new JSONObject();
				jo.put("filePath", fileList.get(i).getFilePath());
				jo.put("content",  fileList.get(i).getContent());
				jo.put("sha", fileList.get(i).getSha());
				ja.put(jo);
			}
			response = Response.ok(ja.toString()).build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if (e.getMessage().equals("not found"))
				response = Response.status(Response.Status.NOT_FOUND).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}
	
	/**
	 * Gets a list of root directories of one branch.
	 *
	 * @param branchName the name of the target branch
	 * @param accountId  the id of the user
	 * @param repoName   the name of the target repo
	 * @param token		 the token provided by the user
	 * @return 			 response
	 * @throws Exception
	 */
	@GET
	@Path("{accountId}/{token}/{repoName}/branch={branchName}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response viewRootDir(@PathParam("branchName") String branchName, @PathParam("accountId") String accountId, @PathParam("repoName") String repoName, @PathParam("token") String token) throws Exception {
		CodeService cs = new CodeService();
		UserService us = new UserService();
		Response response = null;
		String role="";
		try {
			role = us.checkAuth(accountId, token);
			us.checkPermision(accountId, repoName, role);
			List<DirListBean> bList = new ArrayList<DirListBean>();
			bList = cs.viewRootDir(repoName, branchName);
			JSONArray ja = new JSONArray();
			for (int i=0; i<bList.size(); i++) {
				JSONObject jo = new JSONObject();
				jo.put("name", bList.get(i).getName());
				jo.put("sha",  bList.get(i).getSha());
				jo.put("type", bList.get(i).getType());
				ja.put(jo);
			}
			response = Response.ok(ja.toString()).build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if (e.getMessage().equals("not found"))
				response = Response.status(Response.Status.NOT_FOUND).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}
	
	
	/**
	 * Deletes a file or folder.
	 *
	 * @param path		 the path of the file or the folder
	 * @param branchName the branch name
	 * @param accountId  the id of the user
	 * @param repoName   the name of the target repo
	 * @param token		 the token provided by the user
	 * @return 			 response
	 * @throws Exception
	 */
	@DELETE
	@Path("{accountId}/{token}/{repoName}/branch={branchName}/{path}")
	public Response deleteFiles(@PathParam("path") String path, @PathParam("branchName") String branchName, @PathParam("accountId") String accountId, @PathParam("repoName") String repoName, @PathParam("token") String token) throws Exception {
		CodeService cs = new CodeService();
		UserService us = new UserService();
		Response response = null;
		path = path.replace("$$", "/");
		String role="";
		try {
			role = us.checkAuth(accountId, token);
			us.checkPermision(accountId, repoName, role);
			cs.deleteFileAndFolder(repoName, branchName, accountId, path);
			response = Response.ok("success").build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if (e.getMessage().equals("not found"))
				response = Response.status(Response.Status.NOT_FOUND).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}

	
	/**
	 * Gets a list of directory objects.
	 *
	 * @param sha        the id string of current directory
	 * @param accountId  the id of the user
	 * @param repoName   the name of the target repo
	 * @param token		 the token provided by the user
	 * @return           response
	 * @throws Exception
	 */
	@GET
	@Path("{accountId}/{token}/{repoName}/branch={branchName}/{sha}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response viewDir(@PathParam("sha") String sha, @PathParam("accountId") String accountId, @PathParam("repoName") String repoName, @PathParam("token") String token) throws Exception {
		CodeService cs = new CodeService();
		UserService us = new UserService();
		Response response = null;
		String role="";
		try {
			role = us.checkAuth(accountId, token);
			us.checkPermision(accountId, repoName, role);
			List<DirListBean> bList = new ArrayList<DirListBean>();
			bList = cs.viewDir(repoName, sha);
			JSONArray ja = new JSONArray();
			for (int i=0; i<bList.size(); i++) {
				JSONObject jo = new JSONObject();
				jo.put("name", bList.get(i).getName());
				jo.put("sha",  bList.get(i).getSha());
				jo.put("type", bList.get(i).getType());
				ja.put(jo);
			}
			response = Response.ok(ja.toString()).build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if (e.getMessage().equals("not found"))
				response = Response.status(Response.Status.NOT_FOUND).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}

	/**
	 * Commits a list of files
	 *
	 * @param fileList   a list (JSON array) of file objects with parameters "filePath" and "content" the user wants to commit
	 * @param branchName the name of the target branch
	 * @param accountId  the id of the user
	 * @param repoName   the name of the target repo
	 * @param token		 the token provided by the user
	 * @return           response
	 * @throws Exception
	 */
	@POST
	@Path("{accountId}/{token}/{repoName}/branch={branchName}/code")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response commitCode (JSONArray fileList, @PathParam("branchName") String branchName, @PathParam("accountId") String accountId, @PathParam("repoName") String repoName, @PathParam("token") String token) throws Exception {
		CodeService cs = new CodeService();
		UserService us = new UserService();
		Response response = null;
		String role="";
		try {
			role = us.checkAuth(accountId, token);
			us.checkPermision(accountId, repoName, role);
			List<FileBean> fList = new ArrayList<FileBean>();
			for (int i=0; i<fileList.length(); i++) {
				FileBean fileBean = new FileBean();
				fileBean.setFilePath(fileList.getJSONObject(i).getString("filePath"));
				fileBean.setContent(fileList.getJSONObject(i).getString("content"));
				fList.add(fileBean);
			}			
			cs.commitCode(fList, accountId, repoName, branchName);
			response = Response.ok("success").build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if (e.getMessage().equals("not found"))
				response = Response.status(Response.Status.NOT_FOUND).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}

	
	/**
	 * View a code file.
	 *
	 * @param sha        the id string of a file
	 * @param accountId  the id of the user
	 * @param repoName   the name of the target repo
	 * @param token		 the token provided by the user
	 * @return           response
	 * @throws Exception
	 */
	@GET
	@Path("{accountId}/{token}/{repoName}/branch={branchName}/{sha}/code")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response viewCode(@PathParam("sha") String sha, @PathParam("accountId") String accountId, @PathParam("repoName") String repoName, @PathParam("token") String token) throws Exception {
		CodeService cs = new CodeService();
		UserService us = new UserService();
		Response response = null;
		String role="";
		try {
			role = us.checkAuth(accountId, token);
			us.checkPermision(accountId, repoName, role);
			String code = cs.viewCode(sha, repoName);
			response = Response.ok(code).build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if (e.getMessage().equals("not found"))
				response = Response.status(Response.Status.NOT_FOUND).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}

	
	/**
	 * Creates a folder
	 *
	 * @param folder     a new folder object (a JSON object)
	 * @param branchName the name of the target branch
	 * @param accountId  the id of the user
	 * @param repoName   the name of the target repo
	 * @param token		 the token provided by the user
	 * @return           response
	 * @throws Exception
	 */
	@POST
	@Path("{accountId}/{token}/{repoName}/branch={branchName}/folder")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response createFolder (JSONObject folder, @PathParam("branchName") String branchName, @PathParam("accountId") String accountId, @PathParam("repoName") String repoName, @PathParam("token") String token) throws Exception {
		CodeService cs = new CodeService();
		UserService us = new UserService();
		Response response = null;
		String role="";
		try {
			role = us.checkAuth(accountId, token);
			us.checkPermision(accountId, repoName, role);
			cs.createFolder(folder.getString("path"), repoName, branchName,accountId);
			response = Response.ok("success").build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if (e.getMessage().equals("not found"))
				response = Response.status(Response.Status.NOT_FOUND).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}

	/**
	 * Reverts code
	 *
	 * @param branchName the name of the target branch
	 * @param sha        the id string of the commission
	 * @param accountId  the id of the user
	 * @param repoName   the name of the target repo
	 * @param token		 the token provided by the user
	 * @return           response
	 * @throws Exception
	 */
	@POST
	@Path("{accountId}/{token}/{repoName}/branch={branchName}/{sha}/revert")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response revertCode(@PathParam("branchName") String branchName, @PathParam("sha") String sha, @PathParam("accountId") String accountId, @PathParam("repoName") String repoName, @PathParam("token") String token) throws Exception {
		CodeService cs = new CodeService();
		UserService us = new UserService();
		Response response = null;
		String role="";
		try {
			role = us.checkAuth(accountId, token);
			us.checkPermision(accountId, repoName, role);
			cs.revertCode(repoName, branchName, sha, accountId);
			response = Response.ok("success").build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if (e.getMessage().equals("not found"))
				response = Response.status(Response.Status.NOT_FOUND).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}

	/**
	 * View a list of code versions.
	 *
	 * @param joo        a JSON object of the repository with parameter "path"
	 * @param accountId  the id of the user
	 * @param repoName   the name of the target repository
	 * @param branchName    the name of branch
	 * @param token		 the token provided by the user
	 * @return           response
	 * @throws Exception
	 */
	@POST
	@Path("{accountId}/{token}/{repoName}/branch={branchName}/versions")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response viewVersions(JSONObject joo, @PathParam("accountId") String accountId, @PathParam("repoName") String repoName, @PathParam("token") String token, @PathParam("branchName") String branchName) throws Exception {
		CodeService cs = new CodeService();
		UserService us = new UserService();
		Response response = null;
		String role="";
		try {
			role = us.checkAuth(accountId, token);
			us.checkPermision(accountId, repoName, role);
			String path = joo.getString("path");
			List<VersionBean> vList = cs.viewVersion(path, repoName, branchName);
			JSONArray ja = new JSONArray();
			for (int i=0; i<vList.size(); i++) {
				JSONObject jo = new JSONObject();
				jo.put("commiterId", vList.get(i).getCommiterId());
				jo.put("sha", vList.get(i).getSha());
				jo.put("commitTime", vList.get(i).getCommitTime());
				ja.put(jo);
			}
			response = Response.ok(ja.toString()).build();
		}
		catch (Exception e){
			if(e.getMessage().equals("invalid"))
				response = Response.status(Response.Status.FORBIDDEN).build();
			else if (e.getMessage().equals("not found"))
				response = Response.status(Response.Status.NOT_FOUND).build();
			else 
				response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		return response;
	}
}
