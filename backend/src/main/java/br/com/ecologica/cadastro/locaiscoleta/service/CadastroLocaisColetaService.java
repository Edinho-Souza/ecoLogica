package br.com.ecologica.cadastro.locaiscoleta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.ecologica.cadastro.CadastroLocaisColeta;
import br.com.ecologica.cadastro.CadastroEmpresasRecicladoras;
import br.com.ecologica.cadastro.CadastroTipoMateriais;
import br.com.ecologica.cadastro.locaiscoleta.dto.LocalColetaRequest;
import br.com.ecologica.cadastro.locaiscoleta.repository.CadastroLocaisColetaRepository;
import br.com.ecologica.cadastro.empresasrecicladoras.repository.CadastroEmpresasRecicladorasRepository;
import br.com.ecologica.cadastro.tipomateriais.repository.CadastroTipoMateriaisRepository;
import br.com.ecologica.cadastro.usuarios.model.TipoUsuario;
import br.com.ecologica.cadastro.usuarios.model.Usuario;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class CadastroLocaisColetaService {

	@Autowired
	private CadastroLocaisColetaRepository repository;

	@Autowired
	private CadastroEmpresasRecicladorasRepository recicladoraRepository;

	// Repositório para buscar os tipos de materiais
	@Autowired
	private CadastroTipoMateriaisRepository tipoMaterialRepository;

	// Método salvar
	public CadastroLocaisColeta salvar(LocalColetaRequest request, Usuario usuarioAutenticado) {
		if (usuarioAutenticado.getTipoUsuario() != TipoUsuario.recicladora
				&& usuarioAutenticado.getTipoUsuario() != TipoUsuario.admin) {
			throw new AccessDeniedException("Usuário não tem permissão para criar locais de coleta.");
		}
		Long idRecicladora = usuarioAutenticado.getId();
		CadastroEmpresasRecicladoras recicladora = recicladoraRepository.findById(idRecicladora)
				.orElseThrow(() -> new RuntimeException("Empresa Recicladora não encontrada para o usuário logado"));
		CadastroLocaisColeta local = new CadastroLocaisColeta();
		local.setNome(request.getNome());
		local.setEndereco(request.getEndereco());
		local.setEmpresaRecicladora(recicladora);
		return repository.save(local);
	}

	// Método atualizar
	public Optional<CadastroLocaisColeta> atualizar(Long id, LocalColetaRequest request, Usuario usuarioAutenticado) {
		return repository.findById(id).map(local -> {
			checarPropriedadeOuAdmin(local, usuarioAutenticado);
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

	// Método deletar
	public void deletar(Long id, Usuario usuarioAutenticado) {
		CadastroLocaisColeta local = repository.findById(id)
				.orElseThrow(() -> new RuntimeException("Local de Coleta não encontrado"));
		checarPropriedadeOuAdmin(local, usuarioAutenticado);
		repository.deleteById(id);
	}

	// Método para adicionar um tipo de material a um local
	@Transactional
	public CadastroLocaisColeta adicionarMaterial(Long localId, Long tipoMaterialId, Usuario usuarioAutenticado) {
		CadastroLocaisColeta local = repository.findById(localId)
				.orElseThrow(() -> new RuntimeException("Local de Coleta não encontrado"));

		// Valida se o usuário é dono do local
		checarPropriedadeOuAdmin(local, usuarioAutenticado);

		CadastroTipoMateriais tipoMaterial = tipoMaterialRepository.findById(tipoMaterialId)
				.orElseThrow(() -> new RuntimeException("Tipo de Material não encontrado"));

		// Adiciona se ainda não estiver na lista
		if (!local.getTiposMateriaisAceitos().contains(tipoMaterial)) {
			local.getTiposMateriaisAceitos().add(tipoMaterial);
			return repository.save(local);
		}
		return local;
	}

	// Método para remover um tipo de material de um local
	@Transactional
	public void removerMaterial(Long localId, Long tipoMaterialId, Usuario usuarioAutenticado) {
		CadastroLocaisColeta local = repository.findById(localId)
				.orElseThrow(() -> new RuntimeException("Local de Coleta não encontrado"));

		// Valida se o usuário é dono do local
		checarPropriedadeOuAdmin(local, usuarioAutenticado);

		CadastroTipoMateriais tipoMaterial = tipoMaterialRepository.findById(tipoMaterialId)
				.orElseThrow(() -> new RuntimeException("Tipo de Material não encontrado"));

		if (local.getTiposMateriaisAceitos().contains(tipoMaterial)) {
			local.getTiposMateriaisAceitos().remove(tipoMaterial);
			repository.save(local);
		}
	}

	// Método auxiliar
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