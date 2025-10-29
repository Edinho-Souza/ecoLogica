package br.com.ecologica.cadastro.usuarios.controller;

import br.com.ecologica.cadastro.usuarios.dto.UsuarioRequest;
import br.com.ecologica.cadastro.usuarios.dto.UsuarioResponse;
import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.cadastro.usuarios.service.UsuarioService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder; 

    @PostMapping
    public ResponseEntity<UsuarioResponse> criarUsuario(@Valid @RequestBody UsuarioRequest request) {
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha())); 
        usuario.setPerfil(request.getPerfil());
        usuario.setCpf(request.getCpf());

        Usuario salvo = usuarioService.salvar(usuario);
        UsuarioResponse response = usuarioService.converterParaResponse(salvo);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
