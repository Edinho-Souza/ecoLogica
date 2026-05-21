package br.com.ecologica.controller;

import br.com.ecologica.dto.LoginResponse;
import br.com.ecologica.model.UsuarioLogin;
import br.com.ecologica.service.LoginService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody UsuarioLogin login) {
        return ResponseEntity.ok(loginService.autenticar(login.getEmail(), login.getSenha()));
    }
}
