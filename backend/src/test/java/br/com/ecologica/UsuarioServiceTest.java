package br.com.ecologica;

import br.com.ecologica.model.Usuario;
import br.com.ecologica.repository.UsuarioRepository;
import br.com.ecologica.service.UsuarioService;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    public UsuarioServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSalvarUsuario() {
        Usuario usuario = new Usuario();
        usuario.setNome("Jonas");
        usuario.setEmail("jonas@email.com");
        usuario.setSenha("123456");
        usuario.setPerfil("ADMIN");
        usuario.setCpf("07612399954");

        when(usuarioRepository.save(any())).thenReturn(usuario);

        Usuario resultado = usuarioService.salvar(usuario);

        assertNotNull(resultado);
        assertEquals("Jonas", resultado.getNome());
        verify(usuarioRepository, times(1)).save(usuario);
    }

    @Test
    public void testBuscarPorId() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Jonas");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Usuario resultado = usuarioService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals("Jonas", resultado.getNome());
    }

    @Test
    public void testListarTodos() {
        Usuario u1 = new Usuario();
        u1.setNome("Jonas");
        Usuario u2 = new Usuario();
        u2.setNome("Maria");

        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        List<Usuario> lista = usuarioService.listarTodos();

        assertEquals(2, lista.size());
    }
}
