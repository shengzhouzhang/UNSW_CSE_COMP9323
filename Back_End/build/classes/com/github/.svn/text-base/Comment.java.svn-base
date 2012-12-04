package com.github;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import java.io.IOException;
import java.net.URI;
import java.util.List;

import javax.ws.rs.core.UriBuilder;

import org.eclipse.egit.github.core.CommitComment;
import org.eclipse.egit.github.core.Repository;
import org.eclipse.egit.github.core.client.GitHubClient;
import org.eclipse.egit.github.core.service.CommitService;
import org.eclipse.egit.github.core.service.OAuthService;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

public class Comment {
	private Auth auth = new Auth();
	private GitHubClient client = auth.createClient(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);

	/**
	 * Creates a new comment in a file.
	 *
	 * @param repoName 		  the name of the repository
	 * @param sha   		  the sha of the file/folder/commit that want to add comment on
	 * @param commentContent  the comment user wants to commit
	 * @param line			  the line number the user wants to commit a comment
	 * @param path 			  the path of the file
	 * @return      		  the new created comment object
	 * @throws     			  IOException
	 */
	public CommitComment addComment(String repoName, String sha, String commentContent, int line, String path) throws IOException {
		Comm comm = new Comm();			
		CommitComment newComment = new CommitComment();
		newComment.setBody(commentContent);
		newComment.setPosition(line);
		newComment.setPath(path);
		CommitService commitService = new CommitService();
		Repo repo = new Repo();
		commitService.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		commitService.addComment(repo.getRepo(repoName), sha, newComment);
		return newComment;
	}
	
	/**
	 * Modifies the existing comment in a file.
	 *
	 * @param repoName 		  the name of the repository
	 * @param branch 		  the name of the branch
	 * @param id        	  the id of the comment 
	 * @return      		  the the modified comment object
	 * @throws     			  IOException
	 */
	public CommitComment editComment(String repoName, String commentContent, long id) throws IOException {
		CommitComment editComment = new CommitComment();
		editComment.setBody(commentContent);
		editComment = client.post("/repos/"+githubAccountInfo.USERNAME+"/"+repoName+"/comments/"+id, editComment, CommitComment.class);
		return editComment;
	}
	
	/**
	 * Deletes a existing comment.
	 *
	 * @param repoName 		 the name of the repository
	 * @param commentId      the id of the comment 
	 * @throws     			 IOException
	 */
	public void deleteComment(String repoName,long commentId) throws IOException {
		client.delete("/repos/"+githubAccountInfo.USERNAME+"/"+repoName+"/comments/"+commentId);
	}

	/**
	 * Lists a existing comment.
	 *
	 * @param repoName 	the name of the repository
	 * @param sha       the id of a commit
	 * @throws     		IOException
	 */
	public List<CommitComment> getComments (String repoName, String sha) throws IOException {
		Repository myRepo = new Repository();
		Repo repo = new Repo();
		myRepo =repo.getRepo(repoName);
		
		Comm comm = new Comm();			
		
		CommitService commitService = new CommitService();
		return commitService.getComments(myRepo, sha);
	}

}
