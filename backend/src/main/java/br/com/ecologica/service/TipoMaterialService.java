package br.com.ecologica.service;

import br.com.ecologica.cadastros.CadastroTipoMateriais;
import br.com.ecologica.dto.TipoMateriaisRequest;
import br.com.ecologica.repository.CadastroLocaisColetaRepository;
import br.com.ecologica.repository.CadastroTipoMateriaisRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class TipoMaterialService {
    @Autowired
    private CadastroTipoMateriaisRepository repository;
    @Autowired
    private CadastroLocaisColetaRepository locaisColetaRepository;
    
    public List<CadastroTipoMateriais> listarTodos() {
        return repository.findAll();
    }

    public Optional<CadastroTipoMateriais> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public CadastroTipoMateriais criar(TipoMateriaisRequest request) {
        CadastroTipoMateriais tipoM = new CadastroTipoMateriais();
        tipoM.setNomeTipo(request.getNomeTipo());
        tipoM.setDescricao(request.getDescricao());
        tipoM.setAtivo(request.isAtivo());
        return repository.save(tipoM);
    }

    public CadastroTipoMateriais atualizar(Long id, TipoMateriaisRequest request) {
        CadastroTipoMateriais existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de Material não encontrado"));

        existente.setNomeTipo(request.getNomeTipo());
        existente.setDescricao(request.getDescricao());
        existente.setAtivo(request.isAtivo());
        return repository.save(existente);
    }
    
    @Transactional
    public void deletar(Long id) {
        CadastroTipoMateriais tipo = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de Material nao encontrado"));

        locaisColetaRepository.findAll().forEach(local -> {
            if (local.getTiposMateriaisAceitos() != null && local.getTiposMateriaisAceitos().remove(tipo)) {
                locaisColetaRepository.save(local);
            }
        });
        repository.delete(tipo);
    }
}
