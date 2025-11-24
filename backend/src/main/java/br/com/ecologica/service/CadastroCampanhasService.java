package br.com.ecologica.service;

import br.com.ecologica.cadastros.CadastroCampanhas;
import br.com.ecologica.cadastros.CadastroEmpresasApoiadoras;
import br.com.ecologica.dto.CampanhaRequest;
import br.com.ecologica.repository.CadastroCampanhasRepository;
import br.com.ecologica.repository.CadastroEmpresasApoiadorasRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CadastroCampanhasService {

    @Autowired
    private CadastroCampanhasRepository repository;
    @Autowired
    private CadastroEmpresasApoiadorasRepository apoiadoraRepository;

    public List<CadastroCampanhas> listarCampanhasAtivas() {
        LocalDate hoje = LocalDate.now();
        return repository.findByDataInicioLessThanEqualAndDataFimGreaterThanEqual(hoje, hoje);
    }
    
    public List<CadastroCampanhas> listarTodas() {
        return repository.findAll();
    }

    public Optional<CadastroCampanhas> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public CadastroCampanhas salvar(CampanhaRequest request) {
        CadastroEmpresasApoiadoras apoiadora = apoiadoraRepository.findById(request.getIdApoiadora())
                .orElseThrow(() -> new RuntimeException("Empresa Apoiadora não encontrada"));

        CadastroCampanhas campanha = new CadastroCampanhas();
        campanha.setTitulo(request.getTitulo());
        campanha.setDescricao(request.getDescricao());
        campanha.setDataInicio(request.getDataInicio());
        campanha.setDataFim(request.getDataFim());
        campanha.setEmpresaApoiadora(apoiadora);

        return repository.save(campanha);
    }

    public CadastroCampanhas atualizar(Long id, CampanhaRequest request) {
        CadastroCampanhas campanhaExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campanha não encontrada"));
        
        CadastroEmpresasApoiadoras apoiadora = apoiadoraRepository.findById(request.getIdApoiadora())
                .orElseThrow(() -> new RuntimeException("Empresa Apoiadora não encontrada"));

        campanhaExistente.setTitulo(request.getTitulo());
        campanhaExistente.setDescricao(request.getDescricao());
        campanhaExistente.setDataInicio(request.getDataInicio());
        campanhaExistente.setDataFim(request.getDataFim());
        campanhaExistente.setEmpresaApoiadora(apoiadora);

        return repository.save(campanhaExistente);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}