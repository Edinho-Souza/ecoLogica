package br.com.ecologica.controller;

import br.com.ecologica.model.UsuarioLogin;
import br.com.ecologica.service.LoginService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
public class LoginController {

	@Autowired
	private LoginService loginService;

	@PostMapping
	public ResponseEntity<String> login(@RequestBody UsuarioLogin login) {
		String token = loginService.autenticar(login.getEmail(), login.getSenha());
		if (token != null) {
			return ResponseEntity.ok(token);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas.");
		}
	}
}