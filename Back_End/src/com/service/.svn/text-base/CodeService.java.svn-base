package com.service;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import it.sauronsoftware.base64.Base64;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.security.auth.login.AccountException;

import org.eclipse.egit.github.core.Blob;
import org.eclipse.egit.github.core.CommitFile;
import org.eclipse.egit.github.core.Repository;
import org.eclipse.egit.github.core.RepositoryBranch;
import org.eclipse.egit.github.core.RepositoryCommit;
import org.eclipse.egit.github.core.TreeEntry;
import org.omg.PortableInterceptor.SUCCESSFUL;

import com.bean.DirListBean;
import com.bean.FileBean;
import com.bean.VersionBean;
import com.dao.RepoDao;
import com.github.Comm;
import com.github.Repo;

public class CodeService{

	/**
	 * Gets a list of branches.
	 *
	 * @param repoName   the name of the target repo
	 * @return           a list of branches
	 * @throws Exception
	 */
	public List<String> viewBranches(String repoName) throws Exception {
		try {
			Repo repo = new Repo();
			Repository repository = repo.getRepo(repoName);
			List<RepositoryBranch> branches = repo.getBranches(repository);
			List<String> branchList = new ArrayList<String>();
			for (int i = 0; i < branches.size(); i++) {
				branchList.add(branches.get(i).getName());
			}
			return branchList;
		} catch (Exception e) {
			if (e.getMessage().equals("NOT FOUND(404)"))
				throw new Exception("not found");
			else
				throw e;
		}
	}
	
	/**
	 * Gets a list of root directories.
	 *
	 * @param repoName   the name of the target repo
	 * @param branchName the name of the target branch
	 * @return           a list of directory objects
	 * @throws Exception
	 */
	public List<DirListBean> viewRootDir(String repoName,String branchName) throws Exception {
		Repo repo = new Repo();
		List<DirListBean> dlBeanList = new ArrayList<DirListBean>();
		Repository repository = repo.getRepo(repoName);
		List<TreeEntry> rootDir=repo.getBaseList(repository, branchName);
		for (int i = 0; i < rootDir.size(); i++) {
			DirListBean dlbean = new DirListBean();
			dlbean.setName(rootDir.get(i).getPath());
			dlbean.setType(rootDir.get(i).getType());
			dlbean.setSha(rootDir.get(i).getSha());
			dlBeanList.add(dlbean);
		}
		return dlBeanList;
	}
	
	/**
	 * Gets a list of directory objects.
	 *
	 * @param repoName   the name of the target repo
	 * @param sha        the id string of current directory
	 * @return           a list of directory objects
	 * @throws Exception
	 */
	public List<DirListBean> viewDir(String repoName,String sha) throws Exception {
		Repo repo = new Repo();
		try {
			List<DirListBean> dlBeanList = new ArrayList<DirListBean>();
			Repository repository = repo.getRepo(repoName);
			List<TreeEntry> rootDir = repo.getFolderList(repository, sha);
			for (int i = 0; i < rootDir.size(); i++) {
				DirListBean dlbean = new DirListBean();
				dlbean.setName(rootDir.get(i).getPath());
				dlbean.setType(rootDir.get(i).getType());
				dlbean.setSha(rootDir.get(i).getSha());
				dlBeanList.add(dlbean);
			}
			return dlBeanList;
		} catch (Exception e) {
			if (e.getMessage().equals("NOT FOUND(404)"))
				throw new Exception("not found");
			else
				throw e;
		}
	}
	
	/**
	 * Commits a list of files
	 *
	 * @param fileBeans  a list of file objects the user wants to commit
	 * @param accountId  the id of the current user
	 * @param repoName   the name of the target repo
	 * @param branchName the name of the target branch
	 * @throws Exception
	 */
	public void commitCode(List<FileBean> fileBeans, String accountId, String repoName,String branchName)
			throws Exception {
		try {
			Comm comm = new Comm();
			RepoDao repoDao = new RepoDao();
			repoDao.OperationLog(repoName, accountId);
			for (int i = 0; i < fileBeans.size(); i++) {
				String content = fileBeans.get(i).getContent();
				content = content + "  ";
				fileBeans.get(i).setContent(content);
			}
			comm.commitFiles(fileBeans, repoName, branchName, accountId);
		} catch (Exception e) {
			if (e.getMessage().equals("NOT FOUND(404)"))
				throw new Exception("not found");
			else
				throw e;
		}
	}

	/**
	 * Reverts code
	 *
	 * @param repoName   the name of the target repo
	 * @param branchName the name of the target branch
	 * @param sha        the id string of the commission
	 * @throws Exception
	 */
	public void revertCode(String repoName, String branchName, String sha,String accountId) throws Exception {
		Repo repo = new Repo();
		try{
			repo.revertVersion(repoName, branchName, sha);
			new RepoDao().OperationLog(repoName, accountId);
		}
		catch(Exception e){
			if(e.getMessage().equals("NOT FOUND(404)"))
				throw new Exception("not found");
			else throw e;
		}
	}

	/**
	 * View a code file.
	 *
	 * @param sha        the id string of a file
	 * @param repoName   the name of the target repo
	 * @return           content
	 * @throws Exception
	 */
	public String viewCode(String sha,String repoName) throws Exception {
		Repo repo = new Repo();
		String decode = null;
		Repository repository = repo.getRepo(repoName);
		Blob blob = repo.getFileContent(repository, sha);
		if(blob.getEncoding().equals(Blob.ENCODING_BASE64))
			decode = Base64.decode(blob.getContent(), Blob.ENCODING_UTF8);
		else {
			decode = blob.getContent();
		}
		return decode;
	}
	
	/**
	 * Creates a branch
	 *
	 * @param repoName   the name of the target repo
	 * @param branchName the name of the target branch
	 * @throws Exception
	 */
	public void createBrach(String repoName,String branchName,String accountId)throws Exception{
		try{
		Repo repo = new Repo();
		repo.createBranch(repoName, branchName);
		new RepoDao().OperationLog(repoName, accountId);
		}
		catch(Exception e){
			if(e.getMessage().equals("NOT FOUND(404)"))
				throw new Exception("not found");
			else throw e;
		}
	}
	
	/**
	 * Deletes a branch.
	 *
	 * @param repoName   the name of the target repo
	 * @param branchName the branch name
	 * @param accountId  the id of the user
	 * @throws Exception
	 */
	public void deleteBrach(String repoName,String branchName,String accountId)throws Exception{
		try{
		Repo repo = new Repo();
		repo.deleteBranch(repoName, branchName);
		new RepoDao().OperationLog(repoName, accountId);
		}
		catch(Exception e){
			if(e.getMessage().equals("NOT FOUND(404)"))
				throw new Exception("not found");
			else throw e;
		}
	}
	
	/**
	 * Gets a list of files
	 *
	 * @param repoName   the name of the target repo
	 * @param commitSHA  the id of the commission
	 * @return 			 a list of file objects
	 * @throws Exception
	 */
	public List<FileBean> viewCommitFile(String repoName,String commitSHA)throws Exception{
		List<FileBean> fileBeans = new ArrayList<FileBean>();
		try {
			Repo repo = new Repo();
			List<CommitFile> commitFiles = repo.viewCommitFile(commitSHA,
					repoName);
			if (commitFiles == null) {
				throw new Exception("No commit files");
			}
			for (int i = 0; i < commitFiles.size(); i++) {
				FileBean fileBean = new FileBean();
				fileBean.setFilePath(commitFiles.get(i).getFilename());
				fileBean.setContent(commitFiles.get(i).getPatch());
				fileBean.setSha(commitFiles.get(i).getSha());
				fileBeans.add(fileBean);
			}
		} catch (Exception e) {
			if (e.getMessage().equals("NOT FOUND(404)"))
				throw new Exception("not found");
			else
				throw e;
		}
		return fileBeans;
	}	
	/**
	 * Creates a folder
	 *
	 * @param path       the path of the new folder
	 * @param repoName   the name of the target repo
	 * @param branchName the name of the target branch
	 * @throws Exception
	 */
	public void createFolder(String path,String repoName,String branchName,String accountId) throws Exception {
		try {
			Comm comm = new Comm();
			comm.commitFolder(path, repoName, branchName,accountId);
			new RepoDao().OperationLog(repoName, accountId);
		}
		catch(Exception e){
			if(e.getMessage().equals("NOT FOUND(404)"))
				throw new Exception("not found");
			else throw e;
		}
	}
	
	/**
	 * View a list of code versions.
	 *
	 * @param path       the path of the repository
	 * @param repoName   the name of the target repository
	 * @param branch   the name of branch
	 * @return           a list of code version objects
	 * @throws Exception
	 */
	public List<VersionBean> viewVersion(String path, String repoName, String branch) throws Exception{
		try {
			Repo repo = new Repo();
			List<RepositoryCommit> repositoryCommits = new ArrayList<RepositoryCommit>();
			List<VersionBean> versionBeans = new ArrayList<VersionBean>();
			if (path.equals("")) {
				repositoryCommits = repo.viewRepoVersions(repo.getRepo(repoName), branch);
			} else {
				repositoryCommits = repo.viewFileVersion(repo.getRepo(repoName),branch, path);
			}
			for (int i = 0; i < repositoryCommits.size(); i++) {
				VersionBean versionBean = new VersionBean();
				versionBean.setSha(repositoryCommits.get(i).getSha());
				versionBean.setCommiterId(repositoryCommits.get(i).getCommit()
						.getMessage());
				versionBean.setCommitTime(repositoryCommits.get(i).getCommit().getCommitter().getDate().toString());
				versionBeans.add(versionBean);
			}
			return versionBeans;
		} catch (Exception e) {
			if (e.getMessage().equals("NOT FOUND(404)"))
				throw new Exception("not found");
			else
				throw e;
		}
	}
	
	
	/**
	 * Deletes a file or folder.
	 *
	 * @param repoName   the name of the target repo
	 * @param branchName the branch name
	 * @param accountId  the id of the user
	 * @param path		 the path of the file or the folder
	 * @throws Exception
	 */
	public void deleteFileAndFolder(String repoName,String branchName,String accountId,String path)throws Exception{
		try{
		Comm comm = new Comm();
		comm.deleteFile(repoName, branchName, path, accountId);
		new RepoDao().OperationLog(repoName, accountId);
		}
		catch(Exception e){
			if(e.getMessage().equals("NOT FOUND(404)"))
				throw new Exception("not found");
			else throw e;
		}
	}
	

}
