package br.com.ecologica.cadastro.usuarios.service;

import br.com.ecologica.cadastro.CadastroEmpresasApoiadoras;
import br.com.ecologica.cadastro.CadastroEmpresasRecicladoras;
import br.com.ecologica.cadastro.empresasapoiadoras.repository.CadastroEmpresasApoiadorasRepository;
import br.com.ecologica.cadastro.empresasrecicladoras.repository.CadastroEmpresasRecicladorasRepository;
import br.com.ecologica.cadastro.usuarios.dto.UsuarioRequest;
import br.com.ecologica.cadastro.usuarios.dto.UsuarioResponse;
import br.com.ecologica.cadastro.usuarios.model.StatusUsuario;
import br.com.ecologica.cadastro.usuarios.model.TipoUsuario;
import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.cadastro.usuarios.repository.UsuarioRepository;
import br.com.ecologica.validacao.ValidadorCNPJ;
import br.com.ecologica.validacao.ValidadorCPF;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepository;
	@Autowired
	private CadastroEmpresasApoiadorasRepository apoiadoraRepository;
	@Autowired
	private CadastroEmpresasRecicladorasRepository recicladoraRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Transactional
	public Usuario salvar(UsuarioRequest request) {

		if (!ValidadorCPF.isCPFValido(request.getCpf())) {
			throw new IllegalArgumentException("CPF inválido.");
		}

		Usuario usuario = new Usuario();
		usuario.setNome(request.getNome());
		usuario.setCpf(request.getCpf());
		usuario.setEmail(request.getEmail());
		usuario.setSenha(passwordEncoder.encode(request.getSenha()));
		usuario.setTipoUsuario(request.getTipoUsuario());

		if (request.getTipoUsuario() == TipoUsuario.cidadao || request.getTipoUsuario() == TipoUsuario.admin) {
			usuario.setStatus(StatusUsuario.ATIVO);
		} else {
			usuario.setStatus(StatusUsuario.PENDENTE);
		}

		Usuario usuarioSalvo = usuarioRepository.save(usuario);

		try {
			if (usuarioSalvo.getTipoUsuario() == TipoUsuario.apoiadora) {
				if (request.getCnpj() == null
						|| !ValidadorCNPJ.isCNPJValido(request.getCnpj().replaceAll("[^0-9]", ""))) {
					throw new IllegalArgumentException("CNPJ inválido ou não fornecido para Empresa Apoiadora.");
				}

				CadastroEmpresasApoiadoras apoiadora = new CadastroEmpresasApoiadoras();
				apoiadora.setUsuario(usuarioSalvo);
				apoiadora.setCnpj(request.getCnpj());
				apoiadora.setEndereco(request.getEndereco());
				apoiadora.setTelefone(request.getTelefone());
				apoiadoraRepository.save(apoiadora);
			} else if (usuarioSalvo.getTipoUsuario() == TipoUsuario.recicladora) {
				if (request.getCnpj() == null
						|| !ValidadorCNPJ.isCNPJValido(request.getCnpj().replaceAll("[^0-9]", ""))) {
					throw new IllegalArgumentException("CNPJ inválido ou não fornecido para Empresa Recicladora.");
				}

				CadastroEmpresasRecicladoras recicladora = new CadastroEmpresasRecicladoras();
				recicladora.setUsuario(usuarioSalvo);
				recicladora.setCnpj(request.getCnpj());
				recicladora.setEndereco(request.getEndereco());
				recicladora.setTelefone(request.getTelefone());
				recicladoraRepository.save(recicladora);
			}
		} catch (Exception e) {
			throw new RuntimeException("Erro ao salvar detalhes da empresa: " + e.getMessage(), e);
		}

		return usuarioSalvo;
	}

	public UsuarioResponse converterParaResponse(Usuario usuario) {
		UsuarioResponse response = new UsuarioResponse();
		response.setId(usuario.getId());
		response.setNome(usuario.getNome());
		response.setEmail(usuario.getEmail());
		response.setTipoUsuario(usuario.getTipoUsuario());
		return response;
	}

	public List<Usuario> listarTodos() {
		return usuarioRepository.findAll();
	}

	public Usuario buscarPorId(Long id) {
		return usuarioRepository.findById(id).orElse(null);
	}

	public void deletar(Long id) {
		usuarioRepository.deleteById(id);
	}
}