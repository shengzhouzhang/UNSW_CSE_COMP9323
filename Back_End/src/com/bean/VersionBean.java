package com.bean;

public class VersionBean {
	private String commiterId;
	private String sha;
	private String commitTime;
	public String getCommiterId() {
		return commiterId;
	}
	public void setCommiterId(String commiterId) {
		this.commiterId = commiterId;
	}
	public String getSha() {
		return sha;
	}
	public void setSha(String sha) {
		this.sha = sha;
	}
	public String getCommitTime() {
		return commitTime;
	}
	public void setCommitTime(String commitTime) {
		this.commitTime = commitTime;
	}

}
