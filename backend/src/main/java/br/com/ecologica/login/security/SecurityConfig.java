package br.com.ecologica.login.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import br.com.ecologica.service.CustomUserDetailsService;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Configuração CORS explícita
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                // Rotas Públicas
                .requestMatchers("/api/login/**", "/api/recuperar-senha/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll() // Cadastro
                .requestMatchers(HttpMethod.GET, 
                    "/api/campanhas/ativas", 
                    "/api/noticias/**", 
                    "/api/ranking",
                    "/api/beneficios", 
                    "/api/locais-coleta/**", 
                    "/api/tipos-materiais",
                    "/api/orientacoes/ativas").permitAll()

                // Rotas Admin
                .requestMatchers("/api/admin/**", "/api/conteudo/**", "/api/estatisticas/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/campanhas", "/api/noticias", "/api/beneficios", "/api/tipos-materiais", "/api/orientacoes").hasAuthority("admin")
                .requestMatchers(HttpMethod.PUT, "/api/campanhas/**", "/api/noticias/**", "/api/beneficios/**", "/api/tipos-materiais/**", "/api/orientacoes/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasAuthority("admin") 

                // Rotas Recicladora e Admin
                .requestMatchers("/api/locais-coleta/**", "/api/dias-horarios/**", "/api/materiais/**").hasAnyAuthority("admin", "recicladora")
                
                // Rotas Autenticadas (Todas as outras)
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200", "http://localhost:3000")); // Adicione as URLs do seu front
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}