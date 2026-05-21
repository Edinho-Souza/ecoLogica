package br.com.ecologica.controller;

import br.com.ecologica.dto.UsuarioRequest;
import br.com.ecologica.dto.UsuarioResponse;
import br.com.ecologica.dto.UsuarioUpdateRequest;
import br.com.ecologica.login.security.CustomUserDetails;
import br.com.ecologica.model.Usuario;
import br.com.ecologica.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> criarUsuario(@Valid @RequestBody UsuarioRequest request) {
        Usuario salvo = usuarioService.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.converterParaResponse(salvo));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {
        List<UsuarioResponse> usuarios = usuarioService.listarTodos().stream()
                .map(usuarioService::converterParaResponse)
                .toList();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> usuarioAutenticado(Authentication authentication) {
        Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
        return ResponseEntity.ok(usuarioService.converterParaResponse(usuario));
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioResponse> atualizarUsuarioAutenticado(
            @Valid @RequestBody UsuarioUpdateRequest request,
            Authentication authentication) {
        Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
        Usuario atualizado = usuarioService.atualizar(usuario.getId(), request, false);
        return ResponseEntity.ok(usuarioService.converterParaResponse(atualizado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.converterParaResponse(usuarioService.buscarPorId(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateRequest request) {
        Usuario atualizado = usuarioService.atualizar(id, request, true);
        return ResponseEntity.ok(usuarioService.converterParaResponse(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
