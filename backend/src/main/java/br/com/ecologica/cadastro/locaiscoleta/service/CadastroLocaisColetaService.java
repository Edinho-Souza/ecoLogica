package br.com.ecologica.cadastro.locaiscoleta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.ecologica.cadastro.CadastroLocaisColeta;
import br.com.ecologica.cadastro.CadastroEmpresasRecicladoras;
import br.com.ecologica.cadastro.locaiscoleta.dto.LocalColetaRequest;
import br.com.ecologica.cadastro.locaiscoleta.repository.CadastroLocaisColetaRepository;
import br.com.ecologica.cadastro.empresasrecicladoras.repository.CadastroEmpresasRecicladorasRepository;
import java.util.List;
import java.util.Optional;

@Service
public class CadastroLocaisColetaService {

    @Autowired
    private CadastroLocaisColetaRepository repository;

    // Repositório para buscar a empresa recicladora
    @Autowired
    private CadastroEmpresasRecicladorasRepository recicladoraRepository;

    public CadastroLocaisColeta salvar(LocalColetaRequest request) {
        // Busca a entidade da empresa recicladora pelo ID
        CadastroEmpresasRecicladoras recicladora = recicladoraRepository.findById(request.getIdRecicladora())
                .orElseThrow(() -> new RuntimeException("Empresa Recicladora não encontrada"));

        CadastroLocaisColeta local = new CadastroLocaisColeta();
        local.setNome(request.getNome());
        local.setEndereco(request.getEndereco());
        local.setEmpresaRecicladora(recicladora);

        return repository.save(local);
    }
    
    public Optional<CadastroLocaisColeta> atualizar(Long id, LocalColetaRequest request) {
        return repository.findById(id).map(local -> {
            CadastroEmpresasRecicladoras recicladora = recicladoraRepository.findById(request.getIdRecicladora())
                    .orElseThrow(() -> new RuntimeException("Empresa Recicladora não encontrada"));

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

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}