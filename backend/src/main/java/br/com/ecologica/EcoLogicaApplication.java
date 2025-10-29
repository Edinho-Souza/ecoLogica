package br.com.ecologica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
	    "br.com.ecologica.cadastro",
	    "br.com.ecologica.login.controller"
	})
	public class EcoLogicaApplication {
	    public static void main(String[] args) {
	        SpringApplication.run(EcoLogicaApplication.class, args);
	    }
	}
