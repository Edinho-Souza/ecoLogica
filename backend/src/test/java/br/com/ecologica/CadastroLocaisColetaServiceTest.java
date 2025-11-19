package br.com.ecologica;

import br.com.ecologica.repository.CadastroLocaisColetaRepository;
import br.com.ecologica.service.CadastroLocaisColetaService;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CadastroLocaisColetaServiceTest {

    @Mock
    private CadastroLocaisColetaRepository repository;

    @InjectMocks
    private CadastroLocaisColetaService service;

    public CadastroLocaisColetaServiceTest() {
       MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSalvarLocal() {
        CadastroLocaisColeta local = new CadastroLocaisColeta();
        local.setNomeLocal("Ponto Verde");
        local.setCidade("Florianópolis");

        when(repository.save(any())).thenReturn(local);

        CadastroLocaisColeta resultado = service.salvar(local);

        assertNotNull(resultado);
        assertEquals("Ponto Verde", resultado.getNomeLocal());
        verify(repository, times(1)).save(local);
    }

    @Test
    public void testBuscarPorId() {
        CadastroLocaisColeta local = new CadastroLocaisColeta();
        local.setId(1L);
        local.setNomeLocal("Eco Ponto");

        when(repository.findById(1L)).thenReturn(Optional.of(local));

        Optional<CadastroLocaisColeta> resultado = service.buscarPorId(1L);

        assertTrue(resultado.isPresent());
        assertEquals("Eco Ponto", resultado.get().getNomeLocal());
    }

    @Test
    public void testListarTodos() {
        CadastroLocaisColeta l1 = new CadastroLocaisColeta();
        l1.setNomeLocal("Ponto A");
        CadastroLocaisColeta l2 = new CadastroLocaisColeta();
        l2.setNomeLocal("Ponto B");

        when(repository.findAll()).thenReturn(Arrays.asList(l1, l2));

        List<CadastroLocaisColeta> lista = service.listarTodos();

        assertEquals(2, lista.size());
    }

    @Test
    public void testDeletarLocal() {
        doNothing().when(repository).deleteById(1L);

        service.deletar(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}
