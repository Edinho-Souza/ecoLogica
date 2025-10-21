
package br.com.ecologica.login.service;

import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.cadastro.usuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean autenticar(String email, String senha) {
        return usuarioRepository.findByEmail(email)
            .map(usuario -> passwordEncoder.matches(senha, usuario.getSenha()))
            .orElse(false);
    }
}
