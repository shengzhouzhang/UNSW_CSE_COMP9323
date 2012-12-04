package com.test;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.eclipse.egit.github.core.Authorization;
import org.eclipse.egit.github.core.CommitComment;
import org.eclipse.egit.github.core.Repository;
import org.eclipse.egit.github.core.client.GitHubClient;
import org.eclipse.egit.github.core.service.CommitService;
import org.eclipse.egit.github.core.service.OAuthService;
import org.eclipse.egit.github.core.service.RepositoryService;

import com.github.Comm;
import com.github.Comment;
import com.github.Repo;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

public class commentTest {

	
	public static void main(String[] args) throws IOException, JSONException {
		String  repoName = "project1";
		
//		Auth a = new Auth();
//		Authorization auth = new Authorization();
//		//connect to github, get token
//		auth = a.createAuth(auth);
				
//		Comm comm = new Comm();			
//		String commitSHA = comm.getCurrentCommitSHA(repoName,"master");		
		
		Comment comment = new Comment();
		
////		add a new comment
		CommitComment newComment = comment.addComment(repoName, "791ac2b3db1a1bbc0ec62756c36a32b77c14b8cb", "aaaaaaaa", 0, null);
		
		//list all the comment of a single commit		
		Comm comm = new Comm();
//		String SHA = comm.getCurrentCommitSHA(repoName, "master");
		List<CommitComment> commentList = comment.getComments(repoName, "791ac2b3db1a1bbc0ec62756c36a32b77c14b8cb");
		for (CommitComment c:commentList) {
			System.out.println("body: " + c.getBody());
			System.out.println("path: " + c.getPath());
			System.out.println("position: " + c.getPosition());
			System.out.println("line: " + c.getLine());
			System.out.println("id: " + c.getId());
			System.out.println("time: " + c.getCreatedAt().toString());
			System.out.println();
		}
		
		
//		//edit a comment
//		CommitComment eComment = new CommitComment();
//		eComment = comment.editComment(repoName, "changesdfsfsdfchange", commentList.get(2).getId());
//		System.out.println("body: " + eComment.getBody());

//		//delete a comment
//		CommitComment dComment = commentList.get(0);
//		long commentId = dComment.getId();
//		comment.deleteComment(repoName, commentId);
		
//		a.deleteAuth(auth.getId());
		
	}
	
	

}