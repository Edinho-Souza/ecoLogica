package br.com.ecologica.service;

import br.com.ecologica.CadastroTipoMateriais;
import br.com.ecologica.dto.TipoMateriaisRequest;
import br.com.ecologica.repository.CadastroTipoMateriaisRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TipoMaterialService {
    @Autowired
    private CadastroTipoMateriaisRepository repository;
    
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
    
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
             throw new RuntimeException("Tipo de Material não encontrado");
        }
        repository.deleteById(id);
    }
}