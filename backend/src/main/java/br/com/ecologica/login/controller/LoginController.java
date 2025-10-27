package br.com.ecologica.login.controller;

import br.com.ecologica.login.model.UsuarioLogin;
import br.com.ecologica.login.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping
    public String login(@RequestBody UsuarioLogin login) {
        boolean autenticado = loginService.autenticar(login.getEmail(), login.getSenha());
        return autenticado ? "Login realizado com sucesso!" : "Credenciais inválidas.";
    }
}