package br.com.ecologica.service;

import br.com.ecologica.cadastros.CadastroEmpresasApoiadoras;
import br.com.ecologica.cadastros.CadastroEmpresasRecicladoras;
import br.com.ecologica.dto.UsuarioRequest;
import br.com.ecologica.dto.UsuarioResponse;
import br.com.ecologica.exception.ResourceNotFoundException;
import br.com.ecologica.model.StatusUsuario;
import br.com.ecologica.model.TipoUsuario;
import br.com.ecologica.model.Usuario;
import br.com.ecologica.repository.CadastroEmpresasApoiadorasRepository;
import br.com.ecologica.repository.CadastroEmpresasRecicladorasRepository;
import br.com.ecologica.repository.UsuarioRepository;
import br.com.ecologica.validacao.ValidadorCNPJ;
import br.com.ecologica.validacao.ValidadorCPF;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private CadastroEmpresasApoiadorasRepository apoiadoraRepository;
    @Autowired
    private CadastroEmpresasRecicladorasRepository recicladoraRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(rollbackFor = Exception.class)
    public Usuario salvar(UsuarioRequest request) throws AccessDeniedException {
        // Regra: Não criar admin via API pública
        if (request.getTipoUsuario() == TipoUsuario.admin) {
            throw new AccessDeniedException("Não é permitido criar um usuário 'admin' por este endpoint.");
        }

        // Validação de Duplicidade
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }
        if (!ValidadorCPF.isCPFValido(request.getCpf())) {
            throw new IllegalArgumentException("CPF inválido.");
        }

        // Construção do Usuário
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setCpf(request.getCpf());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setTipoUsuario(request.getTipoUsuario());

        // Define Status Inicial
        if (request.getTipoUsuario() == TipoUsuario.cidadao) {
            usuario.setStatus(StatusUsuario.ATIVO);
        } else {
            // Empresas entram como pendente
            usuario.setStatus(StatusUsuario.PENDENTE);
        }

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        // Lógica específica para Empresas
        if (request.getTipoUsuario() == TipoUsuario.apoiadora) {
            salvarApoiadora(usuarioSalvo, request);
        } else if (request.getTipoUsuario() == TipoUsuario.recicladora) {
            salvarRecicladora(usuarioSalvo, request);
        }

        return usuarioSalvo;
    }

    private void salvarApoiadora(Usuario usuario, UsuarioRequest request) {
        validarCNPJ(request.getCnpj());
        CadastroEmpresasApoiadoras apoiadora = new CadastroEmpresasApoiadoras();
        apoiadora.setUsuario(usuario);
        apoiadora.setCnpj(request.getCnpj());
        apoiadora.setEndereco(request.getEndereco());
        apoiadora.setTelefone(request.getTelefone());
        apoiadoraRepository.save(apoiadora);
    }

    private void salvarRecicladora(Usuario usuario, UsuarioRequest request) {
        validarCNPJ(request.getCnpj());
        CadastroEmpresasRecicladoras recicladora = new CadastroEmpresasRecicladoras();
        recicladora.setUsuario(usuario);
        recicladora.setCnpj(request.getCnpj());
        recicladora.setEndereco(request.getEndereco());
        recicladora.setTelefone(request.getTelefone());
        recicladoraRepository.save(recicladora);
    }

    private void validarCNPJ(String cnpj) {
        if (cnpj == null || !ValidadorCNPJ.isCNPJValido(cnpj.replaceAll("[^0-9]", ""))) {
            throw new IllegalArgumentException("CNPJ inválido ou obrigatório para empresas.");
        }
    }

    @Transactional
    public Usuario atualizarStatus(Long idUsuario, StatusUsuario novoStatus) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        // Proteção para não bloquear admins acidentalmente
        if (usuario.getTipoUsuario() == TipoUsuario.admin) {
             throw new IllegalArgumentException("Não é possível alterar status de admin via API.");
        }
        
        usuario.setStatus(novoStatus);
        return usuarioRepository.save(usuario);
    }

    public UsuarioResponse converterParaResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.setId(usuario.getId());
        response.setNome(usuario.getNome());
        response.setEmail(usuario.getEmail());
        response.setTipoUsuario(usuario.getTipoUsuario());
        return response;
    }

    // Métodos auxiliares
    public List<Usuario> listarTodos() { return usuarioRepository.findAll(); }
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }
    public void deletar(Long id) {
        if (!usuarioRepository.existsById(id)) throw new ResourceNotFoundException("Usuário não encontrado.");
        usuarioRepository.deleteById(id);
    }
}