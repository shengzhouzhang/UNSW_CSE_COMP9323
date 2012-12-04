package com.service;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.bean.UserBean;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

/**
 * Servlet implementation class testServlet
 */
public class testServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public testServlet() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
//		UserBean uBean = new UserBean();
//		uBean.setAccountId("123321");
//		uBean.setPassword("123321");
//		IUserService userService = new UserService();
//		try {
//			uBean = userService.loginService(uBean.getAccountId(), uBean.getPassword());
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		System.out.println(uBean.getToken());
//		
		GroupService gs = new GroupService();
		List<String> accountIds = new ArrayList<String>();
		accountIds.add("xx");
		accountIds.add("zhl");
		try {
			gs.createGroup("1", "helloWorld", "xn", accountIds);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
//		System.out.println(System.getProperty("catalina.home"));
		
		ClientConfig config = new DefaultClientConfig();
		Client client = Client.create(config);
		WebResource service = client.resource(UriBuilder.fromUri("http://localhost:8080/CodeManagement").build());
//		JSONObject jsonObject = new JSONObject();
//		try {
//			jsonObject.put("username", "123456");
//		} catch (JSONException e1) {
//			// TODO Auto-generated catch block
//			e1.printStackTrace();
//		}
//		try {
//			jsonObject.put("password", "123456");
//		} catch (JSONException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		String cresponse = service.path("rest").path("login").accept(MediaType.APPLICATION_JSON).post(String.class, jsonObject);
//		System.out.println(cresponse);
		
		String accountId = "123456";
		String courseId = service.path("rest").path("group").path("courses").path(accountId).path("").accept(MediaType.APPLICATION_JSON).get(String.class);
		System.out.println(courseId);
	}

}
