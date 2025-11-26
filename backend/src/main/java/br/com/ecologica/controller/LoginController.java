package br.com.ecologica.controller;

import br.com.ecologica.dto.LoginRequestDTO;
import br.com.ecologica.dto.LoginResponseDTO;
import br.com.ecologica.infra.security.TokenService;
import br.com.ecologica.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dados) {
        
        // O Lombok cria o getEmail() e getSenha() automaticamente
        var tokenAutenticacao = new UsernamePasswordAuthenticationToken(dados.getEmail(), dados.getSenha());

        Authentication authentication = manager.authenticate(tokenAutenticacao);
        var usuario = (Usuario) authentication.getPrincipal();
        String tokenJWT = tokenService.gerarToken(usuario);

        return ResponseEntity.ok(new LoginResponseDTO(
            tokenJWT, 
            usuario.getNome(), 
            usuario.getTipoUsuario()
        ));
    }
}