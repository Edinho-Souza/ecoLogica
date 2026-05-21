package br.com.ecologica.service;

import br.com.ecologica.cadastros.CadastroEmpresasApoiadoras;
import br.com.ecologica.cadastros.CadastroEmpresasRecicladoras;
import br.com.ecologica.dto.UsuarioRequest;
import br.com.ecologica.dto.UsuarioResponse;
import br.com.ecologica.dto.UsuarioUpdateRequest;
import br.com.ecologica.exception.ResourceNotFoundException;
import br.com.ecologica.model.StatusUsuario;
import br.com.ecologica.model.TipoUsuario;
import br.com.ecologica.model.Usuario;
import br.com.ecologica.repository.CadastroEmpresasApoiadorasRepository;
import br.com.ecologica.repository.CadastroEmpresasRecicladorasRepository;
import br.com.ecologica.repository.ExibicaoRankingRepository;
import br.com.ecologica.repository.UsuarioRepository;
import br.com.ecologica.validacao.ValidadorCNPJ;
import br.com.ecologica.validacao.ValidadorCPF;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final CadastroEmpresasApoiadorasRepository apoiadoraRepository;
    private final CadastroEmpresasRecicladorasRepository recicladoraRepository;
    private final ExibicaoRankingRepository rankingRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            CadastroEmpresasApoiadorasRepository apoiadoraRepository,
            CadastroEmpresasRecicladorasRepository recicladoraRepository,
            ExibicaoRankingRepository rankingRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.apoiadoraRepository = apoiadoraRepository;
        this.recicladoraRepository = recicladoraRepository;
        this.rankingRepository = rankingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(rollbackFor = Exception.class)
    public Usuario salvar(UsuarioRequest request) {
        if (request.getTipoUsuario() == TipoUsuario.admin) {
            throw new AccessDeniedException("Nao e permitido criar usuario admin por este endpoint.");
        }

        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("E-mail ja cadastrado.");
        }

        String documentoUsuario = resolverDocumentoUsuario(request);
        if (usuarioRepository.findByCpf(documentoUsuario).isPresent()) {
            throw new IllegalArgumentException("Documento ja cadastrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome().trim());
        usuario.setCpf(documentoUsuario);
        usuario.setEmail(request.getEmail().trim());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setTipoUsuario(request.getTipoUsuario());
        usuario.setStatus(request.getTipoUsuario() == TipoUsuario.cidadao ? StatusUsuario.ATIVO : StatusUsuario.PENDENTE);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        if (request.getTipoUsuario() == TipoUsuario.apoiadora) {
            salvarApoiadora(usuarioSalvo, request);
        } else if (request.getTipoUsuario() == TipoUsuario.recicladora) {
            salvarRecicladora(usuarioSalvo, request);
        }

        return usuarioSalvo;
    }

    private void salvarApoiadora(Usuario usuario, UsuarioRequest request) {
        String cnpj = validarCNPJ(request.getCnpj());
        if (apoiadoraRepository.existsByCnpj(cnpj)) {
            throw new IllegalArgumentException("CNPJ ja cadastrado.");
        }

        CadastroEmpresasApoiadoras apoiadora = new CadastroEmpresasApoiadoras();
        apoiadora.setUsuario(usuario);
        apoiadora.setCnpj(cnpj);
        apoiadora.setEndereco(request.getEndereco());
        apoiadora.setTelefone(request.getTelefone());
        apoiadoraRepository.save(apoiadora);
    }

    private void salvarRecicladora(Usuario usuario, UsuarioRequest request) {
        String cnpj = validarCNPJ(request.getCnpj());
        if (recicladoraRepository.existsByCnpj(cnpj)) {
            throw new IllegalArgumentException("CNPJ ja cadastrado.");
        }

        CadastroEmpresasRecicladoras recicladora = new CadastroEmpresasRecicladoras();
        recicladora.setUsuario(usuario);
        recicladora.setCnpj(cnpj);
        recicladora.setEndereco(request.getEndereco());
        recicladora.setTelefone(request.getTelefone());
        recicladoraRepository.save(recicladora);
    }

    private String resolverDocumentoUsuario(UsuarioRequest request) {
        if (request.getTipoUsuario() == TipoUsuario.cidadao) {
            String cpf = normalizarDocumento(request.getCpf());
            if (!ValidadorCPF.isCPFValido(cpf)) {
                throw new IllegalArgumentException("CPF invalido.");
            }
            return cpf;
        }

        // A tabela usuario possui CPF obrigatorio. Para empresas, usamos o
        // CNPJ normalizado como documento unico da credencial.
        return validarCNPJ(request.getCnpj());
    }

    private String validarCNPJ(String cnpj) {
        String cnpjNormalizado = normalizarDocumento(cnpj);
        if (!ValidadorCNPJ.isCNPJValido(cnpjNormalizado)) {
            throw new IllegalArgumentException("CNPJ invalido ou obrigatorio para empresas.");
        }
        return cnpjNormalizado;
    }

    private String normalizarDocumento(String documento) {
        return documento == null ? "" : documento.replaceAll("[^0-9]", "");
    }

    @Transactional
    public Usuario atualizarStatus(Long idUsuario, StatusUsuario novoStatus) {
        Usuario usuario = buscarPorId(idUsuario);

        if (usuario.getTipoUsuario() == TipoUsuario.admin) {
            throw new IllegalArgumentException("Nao e possivel alterar status de admin via API.");
        }

        usuario.setStatus(novoStatus);
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario atualizar(Long id, UsuarioUpdateRequest request, boolean permiteAlterarPerfilPrivilegiado) {
        Usuario usuario = buscarPorId(id);

        if (!permiteAlterarPerfilPrivilegiado && request.getTipoUsuario() != null) {
            throw new AccessDeniedException("Somente administradores podem alterar o tipo de usuario.");
        }

        if (request.getNome() != null && !request.getNome().isBlank()) {
            usuario.setNome(request.getNome().trim());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String email = request.getEmail().trim();
            if (usuarioRepository.existsByEmailAndIdNot(email, id)) {
                throw new IllegalArgumentException("E-mail ja cadastrado.");
            }
            usuario.setEmail(email);
        }

        if (request.getSenha() != null && !request.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        }

        if (request.getFotoPerfil() != null) {
            usuario.setFotoPerfil(request.getFotoPerfil());
        }

        if (permiteAlterarPerfilPrivilegiado && request.getStatus() != null) {
            usuario.setStatus(request.getStatus());
        }

        if (permiteAlterarPerfilPrivilegiado && request.getTipoUsuario() != null && usuario.getTipoUsuario() != TipoUsuario.admin) {
            usuario.setTipoUsuario(request.getTipoUsuario());
        }

        if (request.getCpf() != null && usuario.getTipoUsuario() == TipoUsuario.cidadao) {
            String cpf = normalizarDocumento(request.getCpf());
            if (!ValidadorCPF.isCPFValido(cpf)) {
                throw new IllegalArgumentException("CPF invalido.");
            }
            if (usuarioRepository.existsByCpfAndIdNot(cpf, id)) {
                throw new IllegalArgumentException("CPF ja cadastrado.");
            }
            usuario.setCpf(cpf);
        }

        atualizarDadosEmpresa(usuario, request);
        return usuarioRepository.save(usuario);
    }

    private void atualizarDadosEmpresa(Usuario usuario, UsuarioUpdateRequest request) {
        if (usuario.getTipoUsuario() == TipoUsuario.apoiadora) {
            apoiadoraRepository.findById(usuario.getId()).ifPresent(apoiadora -> {
                if (request.getCnpj() != null && !request.getCnpj().isBlank()) {
                    apoiadora.setCnpj(validarCNPJ(request.getCnpj()));
                }
                if (request.getEndereco() != null) {
                    apoiadora.setEndereco(request.getEndereco());
                }
                if (request.getTelefone() != null) {
                    apoiadora.setTelefone(request.getTelefone());
                }
                apoiadoraRepository.save(apoiadora);
            });
        }

        if (usuario.getTipoUsuario() == TipoUsuario.recicladora) {
            recicladoraRepository.findById(usuario.getId()).ifPresent(recicladora -> {
                if (request.getCnpj() != null && !request.getCnpj().isBlank()) {
                    recicladora.setCnpj(validarCNPJ(request.getCnpj()));
                }
                if (request.getEndereco() != null) {
                    recicladora.setEndereco(request.getEndereco());
                }
                if (request.getTelefone() != null) {
                    recicladora.setTelefone(request.getTelefone());
                }
                recicladoraRepository.save(recicladora);
            });
        }
    }

    public UsuarioResponse converterParaResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.setId(usuario.getId());
        response.setNome(usuario.getNome());
        response.setCpf(usuario.getCpf());
        response.setEmail(usuario.getEmail());
        response.setTipoUsuario(usuario.getTipoUsuario());
        response.setStatus(usuario.getStatus());
        response.setFotoPerfil(usuario.getFotoPerfil());
        response.setPontos(rankingRepository.findByUsuario_Id(usuario.getId())
                .map(ranking -> ranking.getPontos())
                .orElse(0));
        return response;
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado."));
    }

    public void deletar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario nao encontrado.");
        }
        usuarioRepository.deleteById(id);
    }
}
