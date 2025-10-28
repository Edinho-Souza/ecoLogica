package br.com.ecologica.cadastro.empresasapoiadoras.service;

import br.com.ecologica.cadastro.CadastroEmpresasApoiadoras;
import br.com.ecologica.cadastro.empresasapoiadoras.repository.CadastroEmpresasApoiadorasRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@SpringBootTest
public class CadastroEmpresasApoiadorasServiceTest {

    @MockBean
    private CadastroEmpresasApoiadorasRepository repository;

    @Autowired
    private CadastroEmpresasApoiadorasService service;

    @Test
    public void testSalvarEmpresa() {
        CadastroEmpresasApoiadoras empresa = new CadastroEmpresasApoiadoras();
        empresa.setNomeEmpresa("Empresa Teste");
        empresa.setAprovada(true);

        when(repository.save(empresa)).thenReturn(empresa);

        CadastroEmpresasApoiadoras resultado = service.salvar(empresa);
        assertThat(resultado).isNotNull();
        assertThat(resultado.getNomeEmpresa()).isEqualTo("Empresa Teste");
        assertThat(resultado.isAprovada()).isTrue();
    }

    @Test
    public void testBuscarPorId() {
        CadastroEmpresasApoiadoras empresa = new CadastroEmpresasApoiadoras();
        empresa.setId(1L);
        empresa.setNomeEmpresa("Empresa Teste");

        when(repository.findById(1L)).thenReturn(Optional.of(empresa));

        Optional<CadastroEmpresasApoiadoras> resultado = service.buscarPorId(1L);
        assertThat(resultado).isPresent();
        assertThat(resultado.get().getNomeEmpresa()).isEqualTo("Empresa Teste");
    }

    @Test
    public void testDeletarEmpresa() {
        Long id = 1L;
        service.deletar(id);
        verify(repository, times(1)).deleteById(id);
    }

    @Test
    public void testListarAprovadas() {
        CadastroEmpresasApoiadoras empresa1 = new CadastroEmpresasApoiadoras();
        empresa1.setNomeEmpresa("Empresa A");
        empresa1.setAprovada(true);

        CadastroEmpresasApoiadoras empresa2 = new CadastroEmpresasApoiadoras();
        empresa2.setNomeEmpresa("Empresa B");
        empresa2.setAprovada(true);

        when(repository.findByAprovadaTrue()).thenReturn(Arrays.asList(empresa1, empresa2));

        List<CadastroEmpresasApoiadoras> aprovadas = service.listarAprovadas();
        assertThat(aprovadas).hasSize(2);
        assertThat(aprovadas).allMatch(CadastroEmpresasApoiadoras::isAprovada);
    }
}