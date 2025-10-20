package br.com.ecologica.cadastro.tipomateriais.service;

import br.com.ecologica.cadastro.CadastroTipoMateriais;
import br.com.ecologica.cadastro.tipomateriais.repository.CadastroTipoMateriaisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CadastroTipoMateriaisService {

    @Autowired
    private CadastroTipoMateriaisRepository repository;

    public CadastroTipoMateriais salvar(CadastroTipoMateriais tipo) {
        return repository.save(tipo);
    }

    public List<CadastroTipoMateriais> listarTodos() {
        return repository.findAll();
    }

    public Optional<CadastroTipoMateriais> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
