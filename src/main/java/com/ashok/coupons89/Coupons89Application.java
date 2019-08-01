package com.ashok.coupons89;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication(scanBasePackages={"com.ashok"})
public class Coupons89Application extends SpringBootServletInitializer{

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(Coupons89Application.class);
	}
	 
	 
	public static void main(String[] args) {
		SpringApplication.run(Coupons89Application.class, args);
	} 
	
}


