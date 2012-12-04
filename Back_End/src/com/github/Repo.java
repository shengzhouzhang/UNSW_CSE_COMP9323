package com.github;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.eclipse.egit.github.core.Blob;
import org.eclipse.egit.github.core.Commit;
import org.eclipse.egit.github.core.CommitFile;
import org.eclipse.egit.github.core.Reference;
import org.eclipse.egit.github.core.Repository;
import org.eclipse.egit.github.core.RepositoryBranch;
import org.eclipse.egit.github.core.RepositoryCommit;
import org.eclipse.egit.github.core.Tree;
import org.eclipse.egit.github.core.TreeEntry;
import org.eclipse.egit.github.core.TypedResource;
import org.eclipse.egit.github.core.client.GitHubClient;
import org.eclipse.egit.github.core.client.GitHubRequest;
import org.eclipse.egit.github.core.service.CommitService;
import org.eclipse.egit.github.core.service.DataService;
import org.eclipse.egit.github.core.service.RepositoryService;

public class Repo {
	private Auth auth = new Auth();
	private GitHubClient client = auth.createClient(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
	
	/**
	 * Gets a list of repositories
	 *
	 * @return   a list of repository objects
	 * @throws   IOException
	 */	
	public List<Repository> getRepos() throws IOException{
		RepositoryService repositoryService = new RepositoryService();
		repositoryService.getClient().setOAuth2Token(githubAccountInfo.DEFAULTTOKEN);
		return repositoryService.getRepositories();
	}
	
	/**
	 * Gets the details(repository name, id and url) of a repository.
	 *
	 * @throws    IOException
	 */
	public void showRepos() throws IOException{
		ArrayList<Repository> repos = (ArrayList<Repository>) this.getRepos();
		Repository tempRepo = new Repository();
		for (int i = 0; i < repos.size(); i++) {
			tempRepo = repos.get(i);
			System.out.println(tempRepo.getName());
			System.out.println(tempRepo.getId());
			System.out.println(tempRepo.getUrl());
		}
	}
	
	
	/**
	 * Gets a repository according to a given name.
	 *
	 * @param repoName  the name of the repository
	 * @return          a repository object
	 * @throws   		IOException
	 */
	public Repository getRepo(String  repoName) throws IOException{
//		String getRepoString = "/repos/"+githubAccountInfo.USERNAME+"/"+repoName;
//		
//		GitHubRequest gitHubRequest = new GitHubRequest();
//		gitHubRequest.setUri(getRepoString);
//		gitHubRequest.setType(Repository.class);
//		return (Repository) client.get(gitHubRequest).getBody();
		
		RepositoryService rs = new RepositoryService();
		rs.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		return rs.getRepository(githubAccountInfo.USERNAME, repoName);
		
	}
	
	/**
	 * Deletes a repository according to a given name.
	 *
	 * @param repoName  the name of the repository
	 * @throws   		IOException
	 */
	public void  deleteRepo(String repoName) throws IOException{
		String deleteRepoString = "/repos/"+githubAccountInfo.USERNAME+"/"+repoName;
		client.delete(deleteRepoString);
	}
	
	
	/**
	 * Creates a new repository.
	 *
	 * @param repoName     the name of the new repository
	 * @param description  the description of the new repository
	 * @return   		   a new repository object
	 * @throws     		   IOException
	 */
	public Repository createRepo(String repoName,String description) throws IOException, InterruptedException{
		Repository newRepo = new Repository();
		newRepo.setPrivate(false);
		newRepo.setName(repoName);
		newRepo.setDescription(description);
		newRepo = client.post("/user/repos", newRepo, Repository.class);
		
		String gitString = newRepo.getCloneUrl();
		System.out.println(gitString);
		
		String dir = System.getProperty("catalina.home");
		if (dir==null) {
			dir = "";
		}
		else {
			dir = dir +"/";
		}
		String filePath = dir+"shell/init.sh";
		String initialString = "sh "+filePath+" "+gitString;
		String str[ ] = {"/bin/bash","-c",initialString};
		Process pr = Runtime.getRuntime().exec(str);
		if(pr.waitFor() == 0){
            System.out.println("Commandexecute result is OK! Initial repository success!");
        }else{
            System.out.println("Commandexecute result is fail......Initial repository fail!");
        }
		BufferedReader buf = new BufferedReader(new InputStreamReader(pr.getInputStream()));
		String line = "";
		while ((line=buf.readLine())!=null) {
			System.out.println(line);
		}
		return newRepo;
	}
	
	
	/**
	 * Gets a list of repository branches in one repository.
	 *
	 * @param repo  a repository object
	 * @return   	a list of repository objects
	 * @throws     	IOException
	 */
	public List<RepositoryBranch> getBranches (Repository repo) throws IOException{
		RepositoryService rs = new RepositoryService();
		rs.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		return rs.getBranches(repo);
	}
	
	/**
	 * Gets a specific repository branches in one repository.
	 *
	 * @param repo    a repository object
	 * @param branch  the name of the branch
	 * @return   	  a repository object
	 * @throws     	  IOException
	 */
	public RepositoryBranch getBranch(Repository repo, String branch) throws IOException{
		ArrayList<RepositoryBranch> branches = (ArrayList<RepositoryBranch>) getBranches(repo);
		RepositoryBranch repoBranch = new RepositoryBranch();
		for (int i = 0; i < branches.size(); i++) {
			repoBranch = branches.get(i);
			if (repoBranch.getName().equals(branch)) {
				return repoBranch;
			}
		}
		return null;
	}
	
	/**
	 * Gets a list of tree entries (root directory structure) in one branch of one repository.
	 *
	 * @param repo    a repository object
	 * @param branch  the name of the branch
	 * @return   	  a list of tree entries
	 * @throws     	  IOException
	 */
	public List<TreeEntry> getBaseList(Repository repo, String branch) throws IOException{
		RepositoryBranch repoBranch = getBranch(repo, branch);
		
		CommitService commitService = new CommitService();
		commitService.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		DataService dataService = new DataService();
		dataService.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		
		RepositoryCommit repocommit = new RepositoryCommit();
		repocommit = commitService.getCommit(repo, repoBranch.getCommit().getSha());
		
		Tree tree = dataService.getTree(repo, repocommit.getCommit().getTree().getSha());
		return tree.getTree();
	}
	
	/**
	 * Gets a list of tree entries (non-root directory structure) under the root directory in one branch of one repository.
	 *
	 * @param repo    a repository object
	 * @param treeSHA the id of the non-root directory
	 * @return   	  a list of tree entries
	 * @throws     	  IOException
	 */
	public List<TreeEntry> getFolderList(Repository repo, String treeSHA) throws IOException {
		DataService dataService = new DataService();
		dataService.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		
		Tree tree = dataService.getTree(repo, treeSHA);
		return tree.getTree();
	}
	
	/**
	 * Gets the file content from one blob object 
	 *
	 * @param repo    a repository object
	 * @param treeSHA the id of the blob object
	 * @return   	  a blob object
	 * @throws     	  IOException
	 */
	public Blob getFileContent(Repository repo, String blobSHA) throws IOException{
		DataService dataService = new DataService();
		dataService.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		return dataService.getBlob(repo, blobSHA);
	}
	
	/**
	 * Gets a list of commit history in one repository.
	 *
	 * @param repo    a repository object
	 * @param branch  the name of branch
	 * @return   	  a list of commits
	 * @throws     	  IOException
	 */
	public List<RepositoryCommit> viewRepoVersions(Repository repo, String branch) throws IOException{
		CommitService cs = new CommitService();
		cs.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		return cs.getCommits(repo, branch, null);
	}
	
	/**
	 * Gets a list of commit history of one file.
	 *
	 * @param repo    a repository object
	 * @param path	  the path of the file
	 * @param branch   the name of branch
	 * @return   	  a list of commits
	 * @throws     	  IOException
	 */
	public List<RepositoryCommit> viewFileVersion(Repository repo, String branch, String path) throws IOException{
		CommitService cs = new CommitService();
		cs.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		return cs.getCommits(repo	, branch, path);
	}
	
	/**
	 * Goes back to a specific version in the repository.
	 *
	 * @param repoName    the name of a repository
	 * @param branch      the name of a branch
	 * @param commitSHA	  the id of one commission
	 * @throws     	  	  IOException
	 */
	public void revertVersion(String repoName, String branch, String commitSHA) throws IOException {
		DataService ds = new DataService();
		ds.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		Repo repo = new Repo();
		Comm comm = new Comm();
		Repository currentRepo = repo.getRepo(repoName);
		Commit revertCommit = ds.getCommit(currentRepo, commitSHA);
		
		String currentCommitSHA = comm.getCurrentCommitSHA(repoName, branch);
		Commit currentCommit = ds.getCommit(currentRepo, currentCommitSHA);
		
		revertCommit.getParents().clear();
		revertCommit.getParents().add(currentCommit);
		
		Commit newCommit = ds.createCommit(currentRepo, revertCommit);
		System.out.println(newCommit.getUrl());
		
		TypedResource object = new TypedResource();
		object.setSha(newCommit.getSha());
		Reference ref = new Reference();
		ref.setRef("refs/heads/"+branch);
		ref.setObject(object);
		ds.editReference(currentRepo, ref);
	}
	
	/**
	 * Creates a new branch.
	 *
	 * @param repoName    the name of a repository
	 * @param branch      the name of a branch
	 * @throws     		  IOException and InterruptedException
	 */
	public void createBranch (String repoName, String branch) throws IOException, InterruptedException{
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
		String filePath = dir+"shell/createBranch.sh";
//		String filePath = "createBranch.sh ";
		String initialString = "sh "+filePath+" "+repoName+" "+gitString+" "+branch;
		String str[ ] = {"/bin/sh","-c",initialString};
		Process pr = Runtime.getRuntime().exec(str);
		if(pr.waitFor() == 0){
            System.out.println("Commandexecute result is OK! Create branch success!");
        }else{
            System.out.println("Commandexecute result is fail...... Create branch fail!");
        }
		BufferedReader buf = new BufferedReader(new InputStreamReader(pr.getInputStream()));
		String line = "";
		while ((line=buf.readLine())!=null) {
			System.out.println(line);
		}
	}
	
	
	/**
	 * Deletes a branch in one repository.
	 *
	 * @param repoName    a name of the repository object
	 * @param branch	  the name of the branch
	 * @throws     		  IOException and InterruptedException
	 */
	public void deleteBranch (String repoName, String branch) throws IOException, InterruptedException{
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
		String filePath = dir+"shell/deleteBranch.sh";
		String initialString = "sh "+filePath+" "+repoName+" "+gitString+" "+branch;
		String str[ ] = {"/bin/sh","-c",initialString};
		Process pr = Runtime.getRuntime().exec(str);
		if(pr.waitFor() == 0){
            System.out.println("Commandexecute result is OK! Delete branch success!");
        }else{
            System.out.println("Commandexecute result is fail......Delete branch fail!");
        }
		BufferedReader buf = new BufferedReader(new InputStreamReader(pr.getInputStream()));
		String line = "";
		while ((line=buf.readLine())!=null) {
			System.out.println(line);
		}
	}
	
	/**
	 * Gets a list of commit files in one repository.
	 *
	 * @param commitSHA   the id of the repository 
	 * @param repoName    the name of the repository 
	 * @return   		  a list of commit files
	 * @throws     		  IOException
	 */
	public List<CommitFile> viewCommitFile(String commitSHA, String repoName) throws IOException{
		CommitService cs = new CommitService();
		cs.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		
		Repo repo = new Repo();
		Repository repository = repo.getRepo(repoName);
		RepositoryCommit repositoryCommit = cs.getCommit(repository, commitSHA);
		List<CommitFile> commitFiles =  repositoryCommit.getFiles();
		return commitFiles;
	}
}
