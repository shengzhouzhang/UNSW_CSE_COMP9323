package com.test;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.codehaus.jettison.json.JSONObject;
import org.eclipse.egit.github.core.Blob;
import org.eclipse.egit.github.core.Commit;
import org.eclipse.egit.github.core.CommitFile;
import org.eclipse.egit.github.core.Reference;
import org.eclipse.egit.github.core.Repository;
import org.eclipse.egit.github.core.RepositoryCommit;
import org.eclipse.egit.github.core.Tree;
import org.eclipse.egit.github.core.TreeEntry;
import org.eclipse.egit.github.core.TypedResource;
import org.eclipse.egit.github.core.service.CommitService;
import org.eclipse.egit.github.core.service.DataService;

import com.bean.FileBean;
import com.github.Comm;
import com.github.Repo;
import com.github.githubAccountInfo;
import com.github.readfile;


public class repoTest {

	/**
	 * @param args
	 * @throws IOException 
	 * @throws InterruptedException 
	 */
	public static void main(String[] args) throws InterruptedException {
		// TODO Auto-generated method stub
		DataService ds = new DataService();
		ds.getClient().setCredentials(githubAccountInfo.USERNAME, githubAccountInfo.PASSWORD);
		
		Repo repo = new Repo();
		Comm comm = new Comm();
		
		
		
//		
		try {
			Repository repository = new Repository();
			repository = repo.getRepo("TestRepo");
//			repo.deleteRepo("course01227");
			
//			ArrayList<RepositoryCommit> repositoryCommits = (ArrayList<RepositoryCommit>) repo.viewFileVersion(repository, "testBranch","README");
//			for (int i = 0; i < repositoryCommits.size(); i++) {
//				System.out.println(repositoryCommits.get(i).getSha());
//			}
			
//			repo.createRepo("TesrRepo1", "test command");
//			repo.createBranch("TestRepo", "testBranch11");
//			repo.deleteBranch("TestRepo", "testBranch11");
			
//			ArrayList<RepositoryCommit> commits = (ArrayList<RepositoryCommit>) repo.viewFileVersion(repository, "testdirectory/perl_learn");
//			RepositoryCommit rc = new RepositoryCommit();
//			for (int i = 0; i < commits.size(); i++) {
//				 rc = commits.get(i);
//				 System.out.println(rc.getCommit().getMessage());
//			}
//			comm.deleteFile("c05dd9b2ab3263b00e53d412b5c1f22de434936d", "7aded0d4e5f452f3444d7417f2b0901afd4c2033", "TestRepo", "master");
//			comm.commitFolder("hello123/subsubfolder/third", "TestRepo", "master");
//			repo.createBranch("TestRepo", "testBranch6");
//			
//			List<FileBean> files = new ArrayList<FileBean>();
//			FileBean fileBean = new FileBean();
//			fileBean.setContent("I change the content. Hello");
//			fileBean.setFilePath("hello/1.txt");
//			FileBean fileBean2 = new FileBean();
//			fileBean2.setContent("test in subdirectory.");
//			fileBean2.setFilePath("hello/2.txt");
//			files.add(fileBean2);
//			files.add(fileBean);
//			comm.commitFiles(files, "TestRepo", "testBranch", "testShellCommit");
//			comm.commitFolder("hello111/hello11",repository.getName(), "master");
//			
//			
//			repo.getRepo("TestRepo");
//			List<CommitFile> commitFiles = repo.viewCommitFile("267da1d598bb032afff7fdb491ba588cebd89f0d", "TestRepo");
//			System.out.println(commitFiles.toString());
//			
//			comm.deleteFile("TestRepo", "testBranch5", "hello123", "delete files");
		} catch (Exception e) {
			e.getStackTrace();
			System.out.println(e.getMessage());
		}
	}

}
