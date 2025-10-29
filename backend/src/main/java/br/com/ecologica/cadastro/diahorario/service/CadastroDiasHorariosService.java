package br.com.ecologica.cadastro.diahorario.service;

import br.com.ecologica.cadastro.CadastroDiasHorarios;
import br.com.ecologica.cadastro.diahorario.repository.CadastroDiasHorariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CadastroDiasHorariosService {

    @Autowired
    private CadastroDiasHorariosRepository repository;

    public CadastroDiasHorarios salvar(CadastroDiasHorarios horario) {
        return repository.save(horario);
    }

    public List<CadastroDiasHorarios> listarTodos() {
        return repository.findAll();
    }

    public Optional<CadastroDiasHorarios> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}