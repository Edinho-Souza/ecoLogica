package br.com.ecologica.cadastro.diahorario.controller;

import br.com.ecologica.cadastro.CadastroDiasHorarios;
import br.com.ecologica.cadastro.diahorario.dto.DiasHorariosRequest;
import br.com.ecologica.cadastro.diahorario.dto.DiasHorariosResponse;
import br.com.ecologica.cadastro.diahorario.service.CadastroDiasHorariosService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dias-horarios")
public class CadastroDiasHorariosController {

    @Autowired
    private CadastroDiasHorariosService service;

    @GetMapping
    public ResponseEntity<List<DiasHorariosResponse>> listarTodos() {
        List<DiasHorariosResponse> lista = service.listarTodos()
                .stream()
                .map(DiasHorariosResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiasHorariosResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(DiasHorariosResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DiasHorariosResponse> criar(@Valid @RequestBody DiasHorariosRequest request) {
        CadastroDiasHorarios horario = new CadastroDiasHorarios();
        horario.setDiaSemana(request.getDiaSemana());
        horario.setHorarioInicio(request.getHorarioInicio());
        horario.setHorarioFim(request.getHorarioFim());
        horario.setAtivo(request.isAtivo());

        CadastroDiasHorarios salvo = service.salvar(horario);
        DiasHorariosResponse response = DiasHorariosResponse.fromEntity(salvo);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiasHorariosResponse> atualizar(@PathVariable Long id,
                                                          @Valid @RequestBody DiasHorariosRequest request) {
        return service.buscarPorId(id)
                .map(horario -> {
                    horario.setDiaSemana(request.getDiaSemana());
                    horario.setHorarioInicio(request.getHorarioInicio());
                    horario.setHorarioFim(request.getHorarioFim());
                    horario.setAtivo(request.isAtivo());
                    CadastroDiasHorarios atualizado = service.salvar(horario);
                    return ResponseEntity.ok(DiasHorariosResponse.fromEntity(atualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}