package br.com.ecologica.service;

import br.com.ecologica.CadastroDiasHorarios;
import br.com.ecologica.CadastroLocaisColeta;
import br.com.ecologica.dto.DiasHorariosRequest;
import br.com.ecologica.model.TipoUsuario;
import br.com.ecologica.model.Usuario;
import br.com.ecologica.repository.CadastroDiasHorariosRepository;
import br.com.ecologica.repository.CadastroLocaisColetaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CadastroDiasHorariosService {
	@Autowired
	private CadastroDiasHorariosRepository repository;
	
	@Autowired
	private CadastroLocaisColetaRepository localColetaRepository;

	public CadastroDiasHorarios salvar(DiasHorariosRequest request, Usuario usuarioAutenticado) {
		// Busca o Local de Coleta
		CadastroLocaisColeta local = localColetaRepository.findById(request.getLocalColetaId())
				.orElseThrow(() -> new RuntimeException("Local de Coleta não encontrado"));
		// Verifica se o usuário é o dono do local ou se é admin
		checarPropriedadeOuAdmin(local, usuarioAutenticado);
		// Cria a entidade
		CadastroDiasHorarios horario = new CadastroDiasHorarios();
		horario.setLocalColeta(local); 
		horario.setDiaSemana(request.getDiaSemana());
		horario.setHorarioInicio(request.getHorarioInicio());
		horario.setHorarioFim(request.getHorarioFim());
		horario.setAtivo(request.isAtivo());
		return repository.save(horario);
	}

	// Método atualizar
	public Optional<CadastroDiasHorarios> atualizar(Long id, DiasHorariosRequest request, Usuario usuarioAutenticado) {
		return repository.findById(id).map(horario -> {
			// Pega o local de coleta original
			CadastroLocaisColeta localOriginal = horario.getLocalColeta();
			// Verifica se o usuário é o dono do local original
			checarPropriedadeOuAdmin(localOriginal, usuarioAutenticado);
			// Verifica se o usuário está tentando MOVER o horário para outro local
			if (!localOriginal.getId().equals(request.getLocalColetaId())) {
				// Se sim, precisa verificar se ele é dono do NOVO local também
				CadastroLocaisColeta novoLocal = localColetaRepository.findById(request.getLocalColetaId())
						.orElseThrow(() -> new RuntimeException("Novo Local de Coleta não encontrado"));
				checarPropriedadeOuAdmin(novoLocal, usuarioAutenticado);
				horario.setLocalColeta(novoLocal);
			}
			// Atualiza os dados
			horario.setDiaSemana(request.getDiaSemana());
			horario.setHorarioInicio(request.getHorarioInicio());
			horario.setHorarioFim(request.getHorarioFim());
			horario.setAtivo(request.isAtivo());
			return repository.save(horario);
		});
	}

	public List<CadastroDiasHorarios> listarTodos() {
		return repository.findAll();
	}

	public Optional<CadastroDiasHorarios> buscarPorId(Long id) {
		return repository.findById(id);
	}

	public void deletar(Long id, Usuario usuarioAutenticado) {
		CadastroDiasHorarios horario = repository.findById(id)
				.orElseThrow(() -> new RuntimeException("Registro de Dia/Horário não encontrado"));
		// Verifica se o usuário é o dono do local associado
		checarPropriedadeOuAdmin(horario.getLocalColeta(), usuarioAutenticado);
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