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
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Aplica a config de CORS abaixo
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                // --- ROTAS PÚBLICAS (Login e Cadastro) ---
                .requestMatchers("/api/login", "/api/login/**", "/api/recuperar-senha/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()
                
                // Rotas de Leitura Públicas (se desejar)
                .requestMatchers(HttpMethod.GET, 
                    "/api/campanhas/ativas", 
                    "/api/noticias/**", 
                    "/api/ranking",
                    "/api/beneficios", 
                    "/api/locais-coleta/**", 
                    "/api/tipos-materiais",
                    "/api/orientacoes/ativas",
                    "/api/empresas-recicladoras", // Adicionado para evitar erro no dashboard
                    "/api/empresas-apoiadoras"    // Adicionado para evitar erro no dashboard
                ).permitAll()

                // --- ROTAS DE ADMINISTRAÇÃO ---
                .requestMatchers("/api/admin/**", "/api/conteudo/**", "/api/estatisticas/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/campanhas", "/api/noticias", "/api/beneficios", "/api/tipos-materiais", "/api/orientacoes").hasAuthority("admin")
                .requestMatchers(HttpMethod.PUT, "/api/campanhas/**", "/api/noticias/**", "/api/beneficios/**", "/api/tipos-materiais/**", "/api/orientacoes/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasAuthority("admin") 

                // --- ROTAS RECICLADORA E ADMIN ---
                .requestMatchers("/api/locais-coleta/**", "/api/dias-horarios/**", "/api/materiais/**").hasAnyAuthority("admin", "recicladora")
                
                // --- QUALQUER OUTRA ROTA EXIGE LOGIN ---
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

    // =====================================================================
    // CONFIGURAÇÃO CRÍTICA DO CORS (Permite conexão do Frontend)
    // =====================================================================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Adicionei TODAS as portas comuns de desenvolvimento frontend
        configuration.setAllowedOrigins(Arrays.asList(
            "http://127.0.0.1:5500", // VS Code Live Server (IP)
            "http://localhost:5500", // VS Code Live Server (Nome)
            "http://localhost:3000", // React / Node
            "http://localhost:4200"  // Angular
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}