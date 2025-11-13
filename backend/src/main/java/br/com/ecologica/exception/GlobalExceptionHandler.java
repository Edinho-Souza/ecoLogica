package br.com.ecologica.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Captura exceções globais e as formata em respostas HTTP padronizadas.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Trata a ResourceNotFoundException e retorna um 404.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {

        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "status", HttpStatus.NOT_FOUND.value(),
                "error", "Not Found",
                "message", ex.getMessage(),
                "path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    /**
     * Trata AccessDeniedException (ex: falha de segurança) e retorna um 403.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {

        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "status", HttpStatus.FORBIDDEN.value(),
                "error", "Forbidden",
                "message", ex.getMessage(),
                "path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    /**
     * Trata IllegalArgumentException (ex: CNPJ inválido) e retorna um 400.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {

        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "status", HttpStatus.BAD_REQUEST.value(),
                "error", "Bad Request",
                "message", ex.getMessage(),
                "path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
}