package br.com.ecologica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import br.com.ecologica.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Método usado pelo login
    UserDetails findByEmail(String email);
    
}