package br.com.ecologica.service;

import br.com.ecologica.CadastroBeneficios;
import br.com.ecologica.repository.CadastroBeneficiosRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CadastroBeneficiosService {

    @Autowired
    private CadastroBeneficiosRepository repository;

    public CadastroBeneficios salvar(CadastroBeneficios beneficio) {
        return repository.save(beneficio);
    }

    public List<CadastroBeneficios> listarTodos() {
        return repository.findAll();
    }

    public Optional<CadastroBeneficios> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
