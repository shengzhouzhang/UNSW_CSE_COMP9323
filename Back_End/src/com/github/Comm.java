package com.github;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.eclipse.egit.github.core.*;
import org.eclipse.egit.github.core.client.GitHubClient;
import org.eclipse.egit.github.core.service.*;

import com.bean.FileBean;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;



public class Comm {
	
	/**
	 * Commits files.
	 *
	 * @param files			  the file list which needed to be upload
	 * @param repoName 		  the name of the repository
	 * @param branch 		  the name of the branch
	 * @param commitMessage   the accessorial message with the commission
	 * 
	 */
	public void commitFiles(List<FileBean> files, String repoName, String branch, String commitMessage) {
		try {
			Auth auth = new Auth();
			GitHubClient client = auth.createClient(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
			
			Repo repo = new Repo();
			Repository currentRepo = repo.getRepo(repoName);
			currentRepo.setMasterBranch(branch);
			
			System.out.println(currentRepo.getName());
			System.out.println(currentRepo.getId());
			
			String parentCommitSHA =getCurrentCommitSHA(repoName, branch);
			
			RepositoryCommit parentRepoCommit = new RepositoryCommit();
			CommitService commitService = new CommitService();
			commitService.getClient().setOAuth2Token(githubAccountInfo.DEFAULTTOKEN);
			parentRepoCommit = commitService.getCommit(currentRepo, parentCommitSHA);
			
			System.out.println(parentRepoCommit.getCommit().getTree().getUrl());
			String parentTreeSHA = parentRepoCommit.getCommit().getTree().getSha();
		
			DataService ds = new DataService();
			ds.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
			//get parent tree and its tree entries
			Tree parentTree = ds.getTree(currentRepo, parentTreeSHA, true);
			List<TreeEntry> parentFileEntries = new ArrayList<TreeEntry>();
			parentFileEntries = parentTree.getTree();
			
			Tree newTree = new Tree();
//			List<Blob> newBlobs = new ArrayList<Blob>();
			String createBlobString = "/repos/"+githubAccountInfo.USERNAME+"/"+repoName+"/git/blobs";
			for (int i = 0; i < files.size(); i++) {
				FileBean file = files.get(i);
				Blob blob = new Blob();
				blob.setContent(file.getContent());
				blob.setEncoding(Blob.ENCODING_UTF8);
				ShaResource createdBlob = client.post(createBlobString, blob, ShaResource.class);
				
				TreeEntry treeEntry = new TreeEntry();
				treeEntry.setPath(file.getFilePath());
				treeEntry.setMode(TreeEntry.MODE_BLOB);
				treeEntry.setType(TreeEntry.TYPE_BLOB);
				treeEntry.setSha(createdBlob.getSha());
				parentFileEntries.add(treeEntry);
			}
			newTree.setSha(parentTreeSHA);
			newTree.setTree(parentFileEntries);
			String createTreeString = "/repos/"+githubAccountInfo.USERNAME+"/"+repoName+"/git/trees";
			newTree = client.post(createTreeString, newTree, Tree.class);
			
			Commit parentCommit = ds.getCommit(currentRepo, parentCommitSHA);
			Commit newCommit = new Commit();
			newCommit.setMessage(commitMessage);
			List<Commit> parents = new ArrayList<Commit>();
			parents.add(parentCommit);
			newCommit.setParents(parents);
			newCommit.setTree(newTree);
			String createCommitString = "/repos/"+githubAccountInfo.USERNAME+"/"+repoName+"/git/commits";
			
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("author", newCommit.getAuthor()); //$NON-NLS-1$
			params.put("committer", newCommit.getCommitter()); //$NON-NLS-1$
			params.put("message", newCommit.getMessage()); //$NON-NLS-1$
			List<Commit> parents1 = newCommit.getParents();
			if (parents1 != null && parents1.size() > 0) {
				List<String> parentIds = new ArrayList<String>();
				for (Commit parent : parents1)
					parentIds.add(parent.getSha());
				params.put("parents", parentIds); //$NON-NLS-1$
			}
			if (newTree != null)
				params.put("tree", newTree.getSha()); //$NON-NLS-1$
			newCommit = client.post(createCommitString, params, Commit.class);
			
			TypedResource object = new TypedResource();
			object.setSha(newCommit.getSha());
			Reference reference = new Reference();
			reference.setRef("refs/heads/"+branch);
			reference.setObject(object);
			reference = ds.editReference(currentRepo, reference);
		} catch (IOException e) {
			try {
				commitFilesByShell(files, repoName, branch, commitMessage);
			} catch (Exception e1) {
				// TODO Auto-generated catch block
				e1.getMessage();
				e1.printStackTrace();
			}
		}
		
	}
	
	/**
	 * Commits files with shell script.
	 *
	 * @param files			  the file bean list which needed to be upload
	 * @param repoName 		  the name of the repository
	 * @param branch 		  the name of the branch
	 * @param commitMessage   the accessorial message with the commission
	 * 
	 */
	private void commitFilesByShell(List<FileBean> files, String repoName, String branch, String commitMessage) throws IOException, InterruptedException{
		Repo repo = new Repo();
		Repository repository = repo.getRepo(repoName);
		
		String gitString = repository.getCloneUrl();
		String dir = System.getProperty("catalina.home");
		if (dir==null) {
			dir = "";
		}
		else {
			dir = dir +"/";
		}
		String filePath = dir+"shell/updateRepoFolder.sh";
		String updateString = "sh "+filePath+" "+repoName+" "+gitString;
		String str[ ] = {"/bin/bash","-c",updateString};
		Process pr = Runtime.getRuntime().exec(str);
		if(pr.waitFor() == 0){
            System.out.println("Commandexecute result is OK! Update success!");
        }else{
            System.out.println("Commandexecute result is fail......Update fail!");
        }
		BufferedReader buf = new BufferedReader(new InputStreamReader(pr.getInputStream()));
		String line = "";
		while ((line=buf.readLine())!=null) {
			System.out.println(line);
		}
		filePath = dir+"shell/createFile.sh";
		for (int i = 0; i < files.size(); i++) {
			FileBean tempBean = files.get(i);
			String path = tempBean.getFilePath();
			String content = tempBean.getContent();
			String createFileString = "sh "+filePath+" "+repoName+" "+path+" "+branch;
			String str1[ ] = {"/bin/bash","-c",createFileString};
			pr = Runtime.getRuntime().exec(str1);
			if(pr.waitFor() == 0){
	            System.out.println("Commandexecute result is OK! Create file success!");
	        }else{
	            System.out.println("Commandexecute result is fail......Create file fail!");
	        }
			System.out.println(path);
			
			String workDir = System.getProperty("user.dir");
			FileWriter   fw   =   new   FileWriter(workDir+"/"+repoName+"/"+path); 
			fw.write(content);   
			fw.flush();
			fw.close();
		}
		
		filePath=dir+"shell/commitFiles.sh";
		String commitString = "sh "+filePath+" "+repoName+" "+branch+" "+commitMessage;
		String str2[ ] = {"/bin/bash","-c",commitString};
		pr = Runtime.getRuntime().exec(str2);
		if(pr.waitFor() == 0){
            System.out.println("Commandexecute result is OK! Commit success!");
        }else{
            System.out.println("Commandexecute result is fail......Commit fail!");
        }
	}
	
	
//	public String getCurrentCommitSHA(String repoName) throws JSONException {
//		ClientConfig config = new DefaultClientConfig();
//		Client clientWS = Client.create(config);
//		WebResource service = clientWS.resource(getBaseURI());
//		
//		String response_assign = service.path("repos").path(githubAccountInfo.USERNAME).path(repoName).path("branches").accept(MediaType.APPLICATION_JSON).get(String.class);
//		response_assign = response_assign.substring(1, response_assign.length()-1);
//		
//		JSONObject jsonObject = new JSONObject(response_assign);
//		JSONObject commitObject = jsonObject.getJSONObject("commit");
//		String SHA = (String) commitObject.get("sha");
//		return SHA;
//	}
//	
//	private static URI getBaseURI() {
//		return UriBuilder.fromUri(
//		"https://api.github.com/").build();
//	}
	
	
	/**
	 * Gets the sha (id) of the most recent commission in one branch of a repository.
	 *
	 * @param repoName 	the name of the repository
	 * @param branch 	the name of the branch
	 * @return 			the sha of most recent commission
	 * 
	 */
	
	public String getCurrentCommitSHA(String repoName, String branch) throws IOException{
		Repo repo = new Repo();
		Repository currentRepo = repo.getRepo(repoName);
		currentRepo.setMasterBranch(branch);
		
		RepositoryService repositoryService = new RepositoryService();
		repositoryService.getClient().setOAuth2Token(githubAccountInfo.DEFAULTTOKEN);
		List<RepositoryBranch> branches = repositoryService.getBranches(currentRepo);
		RepositoryBranch repositoryBranch = new RepositoryBranch();
		for (int j = 0; j < branches.size(); j++) {
			if (branches.get(j).getName().equals(branch)) {
				repositoryBranch = branches.get(j);
				break;
			}
		}
		return repositoryBranch.getCommit().getSha();
	}
	
	/**
	 * Commits a folder to one branch of a repository.
	 *
	 * @param folderName  the name of the folder should be committed
	 * @param repoName 	  the name of the repository
	 * @param branch 	  the name of the branch
	 * @param commitMessage the accessorial message with the commission
	 * @return 			  the sha of this commission
	 * 
	 */
	public String commitFolder(String folderName,String repoName, String branch, String commitMessage) throws IOException{
		DataService ds = new DataService();
		ds.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		CommitService commitService = new CommitService();
		commitService.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		
		Repo repo = new Repo();
		Repository currentRepo = repo.getRepo(repoName);
		RepositoryCommit repocommit = new RepositoryCommit();
		String currentCommitSHA = getCurrentCommitSHA(repoName, branch);
		repocommit = commitService.getCommit(currentRepo, currentCommitSHA);
		
		Tree parentTree = ds.getTree(currentRepo, repocommit.getCommit().getTree().getSha());
		
		currentRepo.setMasterBranch(branch);
		
		Blob blob = new Blob();
		blob.setContent("!.gitignore");
		blob.setEncoding(Blob.ENCODING_UTF8);
		String blobSHA = ds.createBlob(currentRepo, blob);
		
		List<TreeEntry> entries = new ArrayList<TreeEntry>();
		TreeEntry treeEntry = new TreeEntry();
		treeEntry.setPath(".gitignore");
		treeEntry.setMode(TreeEntry.MODE_BLOB);
		treeEntry.setType(TreeEntry.TYPE_TREE);
		treeEntry.setSha(blobSHA);
		entries.add(treeEntry);
		Tree fileTree = new Tree();
		fileTree = ds.createTree(currentRepo, entries);
		
		
		treeEntry.setPath(folderName);
		treeEntry.setMode(TreeEntry.MODE_DIRECTORY);
		treeEntry.setType(TreeEntry.TYPE_TREE);
		treeEntry.setSha(fileTree.getSha());
		entries.clear();
		entries.add(treeEntry);
		
		Tree folderTree = new Tree();
		folderTree = ds.createTree(currentRepo, entries, parentTree.getSha());
		System.out.println(folderTree.getUrl());
		
		String parentCommitSHA =getCurrentCommitSHA(repoName, branch);
		Commit parentCommit = ds.getCommit(currentRepo, parentCommitSHA);
		Commit newCommit = new Commit();
		newCommit.setMessage(commitMessage);
		List<Commit> parents = new ArrayList<Commit>();
		parents.add(parentCommit);
		newCommit.setParents(parents);
		newCommit.setTree(folderTree);
		
		newCommit = ds.createCommit(currentRepo, newCommit);
		System.out.println(newCommit.getUrl());
		
		TypedResource object = new TypedResource();
		object.setSha(newCommit.getSha());
		Reference ref = new Reference();
		ref.setRef("refs/heads/"+branch);
		ref.setObject(object);
		ds.editReference(currentRepo, ref);
		
		return folderTree.getSha();
	}
	
	
	/**
	 * Deletes a folder or file in one branch of a repository.
	 *
	 * @param repoName 	  the name of the repository
	 * @param branch 	  the name of the branch
	 * @param path  	  the path of the folder or file
	 * @param message     the accessorial message with this change
	 * 
	 */
	public void deleteFile(String repoName, String branch, String path, String message) throws IOException, InterruptedException{
		Repo repo = new Repo();
		Repository repository = repo.getRepo(repoName);
		
		String gitString = repository.getCloneUrl();
		String dir = System.getProperty("catalina.home");
		if (dir==null) {
			dir = "";
		}
		else {
			dir = dir +"/";
		}
		String filePath = dir+"shell/updateRepoFolder.sh";
		String updateString = "sh "+filePath+" "+repoName+" "+gitString;
		String str[ ] = {"/bin/bash","-c",updateString};
		Process pr = Runtime.getRuntime().exec(str);
		if(pr.waitFor() == 0){
            System.out.println("Commandexecute result is OK! Update success!");
        }else{
            System.out.println("Commandexecute result is fail......Update fail!");
        }
		BufferedReader buf = new BufferedReader(new InputStreamReader(pr.getInputStream()));
		String line = "";
		while ((line=buf.readLine())!=null) {
			System.out.println(line);
		}
		
		filePath = dir + "shell/deleteFile.sh";
		String deleteFileString = "sh "+filePath+" "+repoName+" "+branch+" "+path+" "+message;
		String str1[ ] = {"/bin/bash","-c",deleteFileString};
		pr = Runtime.getRuntime().exec(str1);
		if(pr.waitFor() == 0){
            System.out.println("Commandexecute result is OK! Delete success!");
        }else{
            System.out.println("Commandexecute result is fail......Delete fail!");
        }
		
	}
	
}
