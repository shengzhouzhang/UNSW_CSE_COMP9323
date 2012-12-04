package com.github;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.eclipse.egit.github.core.Authorization;
import org.eclipse.egit.github.core.client.GitHubClient;
import org.eclipse.egit.github.core.service.OAuthService;

import com.sun.jersey.api.client.Client;


public class Auth {
	
	private String user = githubAccountInfo.USERNAME;
	private String password = githubAccountInfo.PASSWORD;
	
	/**
	 * Creates an integrated authorization with an incomplete Authorization object.
	 *
	 * @param auth  an incomplete Authorization object
	 * @return      an integrated authorization object
	 * @throws      IOException
	 */
	public Authorization createAuth (Authorization auth) throws IOException{
		OAuthService oAuthService = new OAuthService();
		oAuthService.getClient().setCredentials(user, password);
		return oAuthService.createAuthorization(auth);
	}
	
	
	/**
	 * Deletes an authorization according to a given id.
	 *
	 * @param id  an authorization id
	 * @throws    IOException
	 */
	public void deleteAuth(int id) throws IOException{
		OAuthService oAuthService = new OAuthService();
		oAuthService.getClient().setCredentials(user, password);
		oAuthService.deleteAuthorization(id);
	}
	
	/**
	 * Gets all Authorization objects according to the current user identified information.
	 *
	 * @return   a list of authorization objects
	 * @throws   IOException
	 */	
	public List<Authorization> getAuthList() throws IOException{
		OAuthService oAuthService = new OAuthService();
		oAuthService.getClient().setCredentials(user, password);
		return oAuthService.getAuthorizations();
	}
	
	/**
	 * Gets an authorization object according to a given id.
	 *
	 * @param id  an authorization id
	 * @return    an authorization object
	 * @throws    IOException
	 */
	public Authorization getAuth (int id) throws IOException{
		OAuthService oAuthService = new OAuthService();
		oAuthService.getClient().setCredentials(user, password);
		return oAuthService.getAuthorization(id);
	}
	
	
	/**
	 * Gets the details(authorization id, scope, token and url) of an authorization object.
	 *
	 * @throws    IOException
	 */
	public void showAuths() throws IOException{
		ArrayList<Authorization> auths = (ArrayList<Authorization>) this.getAuthList();
		Authorization tempAuth = new Authorization();
		for (int i = 0; i < auths.size(); i++) {
			tempAuth = auths.get(i);
			System.out.println("AuthId: "+tempAuth.getId());
			System.out.println("AuthScope: "+tempAuth.getScopes());
			System.out.println("AuthToken: "+tempAuth.getToken());
			System.out.println("AuthUrl: "+ tempAuth.getUrl());
			System.out.println();
		}
	}
	
	/**
	 * Creates a Github client object.
	 *
	 * @param username  user name
	 * @param password  user's password
	 * @return    		a Github client object
	 */
	public GitHubClient createClient (String username, String password){
		OAuthService oAuthService = new OAuthService();
		return oAuthService.getClient().setCredentials(user, password);
	}
	
}
