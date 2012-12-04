package com.service;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import java.util.ArrayList;
import java.util.List;

import org.eclipse.egit.github.core.Commit;
import org.eclipse.egit.github.core.CommitComment;

import com.bean.CommentBean;
import com.dao.UserDao;
import com.github.Comment;

public class CommentService {

	/**
	 * Adds a comment.
	 *
	 * @param commentBean  a comment object
	 * @param repoName     the name of the target repository
	 * @param sha          the sha of the target file/folder/commit
	 * @throws Exception
	 */
	public void addComment(CommentBean commentBean, String repoName,String sha)
			throws Exception {
		Comment comment = new Comment();
		try{
			String newContent = commentBean.getCommenterId()+"\n"+commentBean.getCommentContent();
			comment.addComment(repoName, sha ,newContent,commentBean.getPosition(), commentBean.getPath());
		}
		catch(Exception e){
			throw new Exception("404");
		}
	}

	/**
	 * Gets a list of comment objects.
	 *
	 * @param accountId  the id of the current user
	 * @param repoName   the name of the target repository
	 * @param sha        an id string of the comments
	 * @return           a list of comment objects
	 * @throws Exception
	 */
	public List<CommentBean> viewComment(String acountId, String repoName, String sha)
			throws Exception {
		Comment comment = new Comment();
		List<CommitComment> commitComment = new ArrayList<CommitComment>();
		List<CommentBean> commentBeans = new ArrayList<CommentBean>(); 
		try{
			commitComment = comment.getComments(repoName,sha);
			for(int i=0;i<commitComment.size();i++){
				CommentBean commentBean = new CommentBean();
				String newContent = commitComment.get(i).getBody();
				int index = newContent.indexOf("\n");
				String accountId = newContent.substring(0, index);
				newContent = newContent.substring(index+1);
				commentBean.setCommentContent(newContent);
				commentBean.setCommenterId(accountId);
				commentBean.setPosition(commitComment.get(i).getPosition());
				commentBean.setCreatedAt(commitComment.get(i).getCreatedAt());
				commentBean.setPath(commitComment.get(i).getPath());
				commentBeans.add(commentBean);
			}
			
		}
		catch(Exception e){
			throw new Exception("404");
		}
		return commentBeans;
	}



}
