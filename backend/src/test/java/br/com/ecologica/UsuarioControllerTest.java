package br.com.ecologica;

import br.com.ecologica.cadastro.usuarios.controller.UsuarioController;
import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.cadastro.usuarios.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;

@WebMvcTest(UsuarioController.class)
public class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @Test
    public void testListarUsuarios() throws Exception {
        Usuario u1 = new Usuario(1L, "Jonas", "jonas@email.com", "123456", "ADMIN", "07612399954");
        Usuario u2 = new Usuario(2L, "Maria", "maria@email.com", "654321", "USUARIO", "07612399954");

        when(usuarioService.listarTodos()).thenReturn(Arrays.asList(u1, u2));

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Jonas"))
                .andExpect(jsonPath("$[1].nome").value("Maria"));
    }
}