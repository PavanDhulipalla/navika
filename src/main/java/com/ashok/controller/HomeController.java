package com.ashok.controller;

import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController  {

	
	@GetMapping("/")
	public String home(Map<String, Object> model,HttpServletResponse response) {
		
		return "index";
	}
	
}
