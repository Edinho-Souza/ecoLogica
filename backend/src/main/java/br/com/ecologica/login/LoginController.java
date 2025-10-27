package br.com.ecologica.login;

import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.cadastro.usuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public String autenticar(@RequestParam String email, @RequestParam String senha) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getSenha().equals(senha)) {
                return "Login realizado com sucesso!";
            } else {
                return "Senha incorreta.";
            }
        } else {
            return "Usuário não encontrado.";
        }
    }
}
