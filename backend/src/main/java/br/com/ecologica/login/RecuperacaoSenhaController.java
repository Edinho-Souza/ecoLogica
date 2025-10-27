package br.com.ecologica.login;

import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.cadastro.usuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/recuperar-senha")
public class RecuperacaoSenhaController {

    @Autowired
    private UsuarioRepository usuarioRepository;

}