package br.com.ecologica.login.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long expiration = 86400000;

    public String gerarToken(UserDetails userDetails) {
        String email = userDetails.getUsername();

        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("");

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role) 
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    private Claims extrairTodosClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extrairClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extrairTodosClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extrairEmail(String token) {
        return extrairClaim(token, Claims::getSubject);
    }
    
    public Date extrairExpiracao(String token) {
        return extrairClaim(token, Claims::getExpiration);
    }
    
    private Boolean isTokenExpirado(String token) {
        return extrairExpiracao(token).before(new Date());
    }
    
    public Boolean validarToken(String token, UserDetails userDetails) {
        final String email = extrairEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpirado(token));
    }
}