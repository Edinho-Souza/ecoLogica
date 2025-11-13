package br.com.ecologica.login.security;

import br.com.ecologica.cadastro.usuarios.model.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {
	private final Usuario usuario;

	public CustomUserDetails(Usuario usuario) {
		this.usuario = usuario;
	}

	// Adicionado para fácil acesso ao usuário nos controllers
	public Usuario getUsuario() {
		return this.usuario;
	}

	// Retorna a "Role" (TipoUsuario)
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Collections.singletonList(new SimpleGrantedAuthority(usuario.getTipoUsuario().name()));
	}

	@Override
	public String getPassword() {
		return usuario.getSenha();
	}

	@Override
	public String getUsername() {
		return usuario.getEmail();
	}

	// Lógica de status
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		// O login só funciona se o status do usuário for ATIVO
		return usuario.getStatus() == br.com.ecologica.cadastro.usuarios.model.StatusUsuario.ATIVO;
	}
}