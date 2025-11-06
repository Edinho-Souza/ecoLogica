package br.com.ecologica.cadastro.usuarios.controller;

import br.com.ecologica.cadastro.usuarios.dto.UsuarioRequest;
import br.com.ecologica.cadastro.usuarios.dto.UsuarioResponse;
import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.cadastro.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponse> criarUsuario(@Valid @RequestBody UsuarioRequest request) {
        try {
            Usuario salvo = usuarioService.salvar(request); 
            
            UsuarioResponse response = usuarioService.converterParaResponse(salvo);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); 
        } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.CONFLICT).body(null); 
        }
    }
}