package br.com.ecologica.login.service;

import br.com.ecologica.cadastro.usuarios.model.StatusUsuario; // Import
import br.com.ecologica.cadastro.usuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import br.com.ecologica.login.security.JwtUtil;

@Service
public class LoginService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public String autenticar(String email, String senha) {
        return usuarioRepository.findByEmail(email)
                // Valida a senha
                .filter(usuario -> passwordEncoder.matches(senha, usuario.getSenha()))
                // Valida o Status 
                .filter(usuario -> usuario.getStatus() == StatusUsuario.ATIVO) 
                .map(usuario -> jwtUtil.gerarToken(email))
                .orElse(null); 
    }
}