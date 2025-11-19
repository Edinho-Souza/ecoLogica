package br.com.ecologica;

import br.com.ecologica.repository.CadastroEmpresasRecicladorasRepository;
import br.com.ecologica.service.CadastroEmpresasRecicladorasService;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CadastroEmpresasRecicladorasServiceTest {

    @Mock
    private CadastroEmpresasRecicladorasRepository repository;

    @InjectMocks
    private CadastroEmpresasRecicladorasService service;

    public CadastroEmpresasRecicladorasServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSalvarEmpresa() {
    	CadastroEmpresasRecicladoras empresa = new CadastroEmpresasRecicladoras();
    	empresa.setNomeEmpresa("EcoRecicla");
    	empresa.setCidade("Florianópolis");

        when(repository.save(any())).thenReturn(empresa);

        CadastroEmpresasRecicladoras resultado = service.salvar(empresa);

        assertNotNull(resultado);
        assertEquals("EcoRecicla", resultado.getNomeEmpresa());
        verify(repository, times(1)).save(empresa);
    }

    @Test
    public void testBuscarPorId() {
        CadastroEmpresasRecicladoras empresa = new CadastroEmpresasRecicladoras();
        empresa.setId(1L);
        empresa.setNomeEmpresa("EcoRecicla");

        when(repository.findById(1L)).thenReturn(Optional.of(empresa));

        Optional<CadastroEmpresasRecicladoras> resultado = service.buscarPorId(1L);

        assertTrue(resultado.isPresent());
        assertEquals("EcoRecicla", resultado.get().getNomeEmpresa());
    }
}
