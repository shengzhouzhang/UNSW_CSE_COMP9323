package com.bean;

import java.util.Date;

import javax.ws.rs.Path;

public class CommentBean {
	private String commenterId;
	private String commentContent;
	private int position =0;
	private String path = null;
	private Date createdAt;
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date date) {
		this.createdAt = (Date) date;
	}
	public String getCommenterId() {
		return commenterId;
	}
	public void setCommenterId(String commenterId) {
		this.commenterId = commenterId;
	}
	public String getCommentContent() {
		return commentContent;
	}
	public void setCommentContent(String commentContent) {
		this.commentContent = commentContent;
	}
	public int getPosition() {
		return position;
	}
	public void setPosition(int position) {
		this.position = position;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
}
