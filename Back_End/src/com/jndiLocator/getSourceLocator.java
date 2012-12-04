package com.jndiLocator;

import javax.naming.Context;

public class getSourceLocator {
	 public static javax.sql.DataSource ds = setupDatasourceByJndi();
		  private static javax.sql.DataSource setupDatasourceByJndi() {
		        javax.sql.DataSource dataSource = null;
		        try {	           
		        	javax.naming.Context context = new javax.naming.InitialContext();
		        	Context cont =(Context) context.lookup("java:comp/env/");
		            dataSource = (javax.sql.DataSource)cont.lookup("jdbc/9323");
		           // dataSource = (javax.sql.DataSource) cont.lookup("jdbc/auctionOracle");
		        } catch (Exception ex) {
		        	ex.printStackTrace();
		        }
		        return dataSource;
		    }

}
