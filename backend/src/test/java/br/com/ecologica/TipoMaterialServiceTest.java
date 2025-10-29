package br.com.ecologica;

import br.com.ecologica.cadastro.CadastroTipoMateriais;
import br.com.ecologica.cadastro.tipomateriais.dto.TipoMaterialDto;
import br.com.ecologica.cadastro.tipomateriais.repository.CadastroTipoMateriaisRepository;
import br.com.ecologica.cadastro.tipomateriais.service.TipoMaterialService;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TipoMaterialServiceTest {

    @Mock
    private CadastroTipoMateriaisRepository repository;

    @InjectMocks
    private TipoMaterialService service;

    public TipoMaterialServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCriarTipoMaterial() {
        CadastroTipoMateriais tipo = new CadastroTipoMateriais();
        tipo.setNomeTipo("Plástico");
        tipo.setDescricao("Materiais plásticos");
        tipo.setAtivo(true);

        when(repository.save(any())).thenReturn(tipo);

        TipoMaterialDto resultado = service.criar(tipo);

        assertNotNull(resultado);
        assertEquals("Plástico", resultado.getNomeTipo());
        verify(repository, times(1)).save(tipo);
    }

    @Test
    public void testBuscarPorId() {
        CadastroTipoMateriais tipo = new CadastroTipoMateriais();
        tipo.setId(1L);
        tipo.setNomeTipo("Vidro");

        when(repository.findById(1L)).thenReturn(Optional.of(tipo));

        Optional<TipoMaterialDto> resultado = service.buscarPorId(1L);

        assertTrue(resultado.isPresent());
        assertEquals("Vidro", resultado.get().getNomeTipo());
    }

    @Test
    public void testListarTodos() {
        CadastroTipoMateriais t1 = new CadastroTipoMateriais();
        t1.setNomeTipo("Metal");
        CadastroTipoMateriais t2 = new CadastroTipoMateriais();
        t2.setNomeTipo("Papel");

        when(repository.findAll()).thenReturn(Arrays.asList(t1, t2));

        List<TipoMaterialDto> lista = service.listarTodos();

        assertEquals(2, lista.size());
    }

    @Test
    public void testAtualizarTipoMaterial() {
        CadastroTipoMateriais existente = new CadastroTipoMateriais();
        existente.setId(1L);
        existente.setNomeTipo("Plástico");

        when(repository.findById(1L)).thenReturn(Optional.of(existente));
        when(repository.save(any())).thenReturn(existente);

        TipoMaterialDto novo = new TipoMaterialDto();
        novo.setNomeTipo("Plástico Reciclado");
        novo.setDescricao("Atualizado");
        novo.setAtivo(true);

        TipoMaterialDto atualizado = service.atualizar(1L, novo);

        assertEquals("Plástico Reciclado", atualizado.getNomeTipo());
        verify(repository, times(1)).save(existente);
    }

    @Test
    public void testDeletarTipoMaterial() {
        doNothing().when(repository).deleteById(1L);

        service.deletar(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}