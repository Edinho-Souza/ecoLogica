package br.com.ecologica.cadastro.materiais.service;

import br.com.ecologica.cadastro.CadastroLocaisColeta;
import br.com.ecologica.cadastro.CadastroMateriaisColetar;
import br.com.ecologica.cadastro.CadastroTipoMateriais;
import br.com.ecologica.cadastro.locaiscoleta.repository.CadastroLocaisColetaRepository;
import br.com.ecologica.cadastro.materiais.dto.MaterialRequest;
import br.com.ecologica.cadastro.materiais.repository.CadastroMateriaisColetarRepository;
import br.com.ecologica.cadastro.tipomateriais.repository.CadastroTipoMateriaisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CadastroMateriaisColetarService {

    @Autowired
    private CadastroMateriaisColetarRepository repository;

    // Injetando repositórios necessários para associação
    @Autowired
    private CadastroTipoMateriaisRepository tipoMaterialRepository;

    @Autowired
    private CadastroLocaisColetaRepository localColetaRepository;

    // Método 'salvar' recebe o DTO e faz a lógica de associação
    public CadastroMateriaisColetar salvar(MaterialRequest request) {
        
        // Busca as entidades relacionadas
        CadastroTipoMateriais tipo = tipoMaterialRepository.findById(request.getTipoMaterialId())
                .orElseThrow(() -> new RuntimeException("Tipo de material não encontrado"));

        CadastroLocaisColeta local = localColetaRepository.findById(request.getLocalColetaId())
                .orElseThrow(() -> new RuntimeException("Local de coleta não encontrado"));

        // Cria e salva a nova entidade
        CadastroMateriaisColetar material = new CadastroMateriaisColetar();
        material.setNomeMaterial(request.getNomeMaterial());
        material.setDescricao(request.getDescricao());
        material.setReciclavel(request.isReciclavel());
        material.setTipoMaterial(tipo); // Associa a entidade gerenciada
        material.setLocalColeta(local); // Associa a entidade gerenciada

        return repository.save(material);
    }

    public List<CadastroMateriaisColetar> listarTodos() {
        return repository.findAll();
    }

    public Optional<CadastroMateriaisColetar> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}