package br.com.ecologica.cadastro.locaiscoleta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.ecologica.cadastro.CadastroLocaisColeta;
import br.com.ecologica.cadastro.CadastroEmpresasRecicladoras;
import br.com.ecologica.cadastro.locaiscoleta.dto.LocalColetaRequest;
import br.com.ecologica.cadastro.locaiscoleta.repository.CadastroLocaisColetaRepository;
import br.com.ecologica.cadastro.empresasrecicladoras.repository.CadastroEmpresasRecicladorasRepository;
import br.com.ecologica.cadastro.usuarios.model.TipoUsuario;
import br.com.ecologica.cadastro.usuarios.model.Usuario;
import org.springframework.security.access.AccessDeniedException; 
import java.util.List;
import java.util.Optional;

@Service
public class CadastroLocaisColetaService {
	@Autowired
	private CadastroLocaisColetaRepository repository;
	// Repositório para buscar a empresa recicladora
	@Autowired
	private CadastroEmpresasRecicladorasRepository recicladoraRepository;

	// Método salvar atualizado para receber o usuário autenticado
	public CadastroLocaisColeta salvar(LocalColetaRequest request, Usuario usuarioAutenticado) {
		// Admin pode criar para qualquer um (se o DTO for alterado),
		// mas Recicladora SÓ pode criar para si mesma.
		if (usuarioAutenticado.getTipoUsuario() != TipoUsuario.recicladora
				&& usuarioAutenticado.getTipoUsuario() != TipoUsuario.admin) {
			throw new AccessDeniedException("Usuário não tem permissão para criar locais de coleta.");
		}
		// O ID da recicladora é o ID do usuário autenticado
		Long idRecicladora = usuarioAutenticado.getId();
		// Busca a entidade da empresa recicladora pelo ID do usuário
		CadastroEmpresasRecicladoras recicladora = recicladoraRepository.findById(idRecicladora)
				.orElseThrow(() -> new RuntimeException("Empresa Recicladora não encontrada para o usuário logado"));
		CadastroLocaisColeta local = new CadastroLocaisColeta();
		local.setNome(request.getNome());
		local.setEndereco(request.getEndereco());
		local.setEmpresaRecicladora(recicladora);
		return repository.save(local);
	}

	public Optional<CadastroLocaisColeta> atualizar(Long id, LocalColetaRequest request, Usuario usuarioAutenticado) {
		return repository.findById(id).map(local -> {
			// Verifica se o usuário é o dono do local ou se é admin
			checarPropriedadeOuAdmin(local, usuarioAutenticado);
			// Busca a recicladora
			CadastroEmpresasRecicladoras recicladora = local.getEmpresaRecicladora();
			local.setNome(request.getNome());
			local.setEndereco(request.getEndereco());
			local.setEmpresaRecicladora(recicladora); 
			return repository.save(local);
		});
	}

	public List<CadastroLocaisColeta> listarTodos() {
		return repository.findAll();
	}

	public Optional<CadastroLocaisColeta> buscarPorId(Long id) {
		return repository.findById(id);
	}

	public void deletar(Long id, Usuario usuarioAutenticado) {
		CadastroLocaisColeta local = repository.findById(id)
				.orElseThrow(() -> new RuntimeException("Local de Coleta não encontrado"));
		//Verifica se o usuário é o dono do local ou se é admin
		checarPropriedadeOuAdmin(local, usuarioAutenticado);
		repository.deleteById(id);
	}

	// Método auxiliar para validar a propriedade
	private void checarPropriedadeOuAdmin(CadastroLocaisColeta local, Usuario usuario) {
		if (usuario.getTipoUsuario() == TipoUsuario.admin) {
			return;
		}
		if (usuario.getTipoUsuario() == TipoUsuario.recicladora) {
			if (local.getEmpresaRecicladora() == null
					|| !local.getEmpresaRecicladora().getId().equals(usuario.getId())) {
				throw new AccessDeniedException("Acesso negado: Este local de coleta não pertence à sua empresa.");
			}
		} else {
			throw new AccessDeniedException("Acesso negado.");
		}
	}
}