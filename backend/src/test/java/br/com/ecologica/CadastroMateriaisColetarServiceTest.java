package br.com.ecologica;

import br.com.ecologica.cadastro.campanhas.repository.CadastroCampanhasRepository;
import br.com.ecologica.cadastro.materiais.repository.CadastroMateriaisColetarRepository;
import br.com.ecologica.cadastro.materiais.service.CadastroMateriaisColetarService;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CadastroMateriaisColetarServiceTest {

	// DEPOIS (CORRETO):
	@Mock
	private CadastroCampanhasRepository repository; // MOCK DO REPOSITÓRIO CERTO

	@InjectMocks
	private CadastroMateriaisColetarServiceTest service; // INJEÇÃO NO SERVIÇO QUE SERÁ TESTADO

	CadastroMateriaisColetarServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

	@Test
	public void testSalvarMaterial() {
		CadastroMateriaisColetar material = new CadastroMateriaisColetar();
		material.setNomeMaterial("Plástico PET");
		material.setDescricao("Garrafa PET reciclável");

		when(repository.save(any())).thenReturn(material);

		CadastroMateriaisColetarServiceTest resultado = service.salvar(material);

		assertNotNull(resultado);
		assertEquals("Plástico PET", resultado.getNomeMaterial());
		verify(repository, times(1)).save(material);
	}

	@Test
	public void testBuscarPorId() {
		CadastroMateriaisColetar material = new CadastroMateriaisColetar();
		material.setId(1L);
		material.setNomeMaterial("Vidro");

		when(repository.findById(1L)).thenReturn(Optional.of(material));

		Optional<CadastroMateriaisColetarServiceTest> resultado = service.buscarPorId(1L);

		assertTrue(resultado.isPresent());
		assertEquals("Vidro", resultado.get().getNomeMaterial());
	}

	@Test
	public List<CadastroMateriaisColetarServiceTest> testListarTodos() {
		CadastroMateriaisColetar m1 = new CadastroMateriaisColetar();
		m1.setNomeMaterial("Metal");
		CadastroMateriaisColetar m2 = new CadastroMateriaisColetar();
		m2.setNomeMaterial("Papel");

		when(repository.findAll()).thenReturn(Arrays.asList(m1, m2));

		List<CadastroMateriaisColetarServiceTest> lista = service.testListarTodos();

		assertEquals(2, lista.size());
	}

	@Test
	public void testDeletarMaterial() {
		doNothing().when(repository).deleteById(1L);

		service.deletar(1L);

		verify(repository, times(1)).deleteById(1L);
	}
}