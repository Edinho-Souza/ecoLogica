package br.com.ecologica.cadastro.tipomateriais.service;

import br.com.ecologica.cadastro.CadastroTipoMateriais;
import br.com.ecologica.cadastro.tipomateriais.dto.TipoMaterialDto;
import br.com.ecologica.cadastro.tipomateriais.repository.CadastroTipoMateriaisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TipoMaterialService {

    @Autowired
    private CadastroTipoMateriaisRepository repository;

    public Optional<TipoMaterialDto> buscarPorId(Long id) {
        return repository.findById(id).map(this::converterParaDto);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public TipoMaterialDto atualizar(Long id, CadastroTipoMateriais tipoM) {
        CadastroTipoMateriais existente = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tipo de Material não encontrado"));

        existente.setNomeTipo(tipoM.getNomeTipo());
        existente.setDescricao(tipoM.getDescricao());
        existente.setAtivo(tipoM.isAtivo());

        CadastroTipoMateriais atualizado = repository.save(existente);
        return converterParaDto(atualizado);
    }

    public TipoMaterialDto criar(CadastroTipoMateriais tipoM) {
        CadastroTipoMateriais salvo = repository.save(tipoM);
        return converterParaDto(salvo);
    }

    public List<TipoMaterialDto> listarTodos() {
        return repository.findAll().stream()
            .map(this::converterParaDto)
            .collect(Collectors.toList());
    }

    private TipoMaterialDto converterParaDto(CadastroTipoMateriais tipo) {
        TipoMaterialDto dto = new TipoMaterialDto();
        dto.setId(tipo.getId());
        dto.setNomeTipo(tipo.getNomeTipo());
        dto.setDescricao(tipo.getDescricao());
        dto.setAtivo(tipo.isAtivo());
        return dto;
    }
}