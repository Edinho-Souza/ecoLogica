package br.com.ecologica.visualizacao.service;

import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.cadastro.usuarios.repository.UsuarioRepository;
import br.com.ecologica.visualizacao.VisualizacaoEstatisticas;
import br.com.ecologica.visualizacao.dto.EstatisticaRequest;
import br.com.ecologica.visualizacao.repository.EstatisticasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstatisticasService {

    @Autowired
    private EstatisticasRepository repository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<VisualizacaoEstatisticas> listarTodas() {
        return repository.findAll();
    }

    public List<VisualizacaoEstatisticas> listarPorUsuario(Long usuarioId) {
        return repository.findByUsuario_Id(usuarioId);
    }
    
    public VisualizacaoEstatisticas salvar(EstatisticaRequest request) {
        VisualizacaoEstatisticas est = new VisualizacaoEstatisticas();
        
        if(request.getIdUsuario() != null) {
            Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            est.setUsuario(usuario);
        }
        
        est.setTipo(request.getTipo());
        est.setValor(request.getValor());
        est.setData(request.getData());
        
        return repository.save(est);
    }
}