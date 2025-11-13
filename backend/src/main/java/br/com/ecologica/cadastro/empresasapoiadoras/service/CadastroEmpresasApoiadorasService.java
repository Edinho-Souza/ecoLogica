package br.com.ecologica.cadastro.empresasapoiadoras.service;

import br.com.ecologica.cadastro.CadastroEmpresasApoiadoras;
import br.com.ecologica.cadastro.empresasapoiadoras.dto.EmpresaApoiadoraRequest;
import br.com.ecologica.cadastro.empresasapoiadoras.repository.CadastroEmpresasApoiadorasRepository;
import br.com.ecologica.cadastro.usuarios.model.StatusUsuario;
import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.validacao.ValidadorCNPJ; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CadastroEmpresasApoiadorasService {
	@Autowired
	private CadastroEmpresasApoiadorasRepository repository;

	// Atualizar detalhes da empresa
	public Optional<CadastroEmpresasApoiadoras> atualizarDetalhes(Long id, EmpresaApoiadoraRequest request) {
		return repository.findById(id).map(empresa -> {
			// Lógica de validação foi atualizada
			if (!ValidadorCNPJ.isCNPJValido(request.getCnpj())) {
				throw new IllegalArgumentException("CNPJ inválido");
			}
			empresa.setCnpj(request.getCnpj());
			empresa.setEndereco(request.getEndereco());
			empresa.setTelefone(request.getTelefone());
			return repository.save(empresa);
		});
	}

	public List<CadastroEmpresasApoiadoras> listarTodas() {
		return repository.findAll();
	}

	public Optional<CadastroEmpresasApoiadoras> buscarPorId(Long id) {
		return repository.findById(id);
	}

	// Lista empresas que estão ATIVAS
	public List<CadastroEmpresasApoiadoras> listarAprovadas() {
		return repository.findByUsuario_Status(StatusUsuario.ATIVO);
	}

	public void deletar(Long id) {
		repository.deleteById(id);
	}
}