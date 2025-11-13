package br.com.ecologica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling 
@SpringBootApplication
public class EcoLogicaApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcoLogicaApplication.class, args);
	}
}