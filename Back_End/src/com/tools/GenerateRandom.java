package com.tools;
/**
 * @author      Bo Li, Hailun Zhang, Ni Xin, Xiang Xiao
 * @version     1.6                              
 * @since       2012-08-05         
 */
import java.util.Random;

public class GenerateRandom {
	private String allChar = "1234567890abcdefghijk" +
			"lmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	private int length =10;
	
	/**
	 * generate a 10 char long random String
	 * @return  a random string
	 */
	public String GenerateRandomString(){
		StringBuffer sb = new StringBuffer();
		Random random = new Random();
		for(int i = 0;i< length ;i++)
			sb.append(allChar.charAt(random.nextInt(allChar.length())));
		return sb.toString();
	}

}
