package br.com.ecologica.service;

import br.com.ecologica.cadastros.CadastroBeneficios;
import br.com.ecologica.repository.CadastroBeneficiosRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CadastroBeneficiosService {

    private static final Logger log = LoggerFactory.getLogger(CadastroBeneficiosService.class);

    @Autowired
    private CadastroBeneficiosRepository repository;

    // Este método estava correto e não precisa de alteração.
    // O erro que você viu era um reflexo dos erros abaixo.
    public CadastroBeneficios salvar(CadastroBeneficios beneficio) {
        
        // 1. Regra de Padronização: Título em maiúsculas
        String tituloOriginal = beneficio.getTitulo();
        beneficio.setTitulo(tituloOriginal.toUpperCase());

        // 2. Regra de Verificação de Pontos (Exemplo de Alerta/Log)
        if (beneficio.getPontosNecessarios() > 5000) {
            log.warn("⚠️ ALERTA DE BENEFÍCIO CARO: O benefício '{}' requer {} pontos!", 
                beneficio.getTitulo(), beneficio.getPontosNecessarios());
        }

        // Delega ao Repositório APÓS a execução das regras de negócio
        return repository.save(beneficio);
    }
    
    // ❌ CORRIGIDO: Deve retornar List<CadastroBeneficios>
    public List<CadastroBeneficios> listarTodos() {
        return repository.findAll();
    }

    // ❌ CORRIGIDO: Deve retornar Optional<CadastroBeneficios>
    public Optional<CadastroBeneficios> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}