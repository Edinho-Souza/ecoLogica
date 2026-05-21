package br.com.ecologica.login.security;

import br.com.ecologica.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Value;
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

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;
    private final String allowedOrigins;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserDetailsService customUserDetailsService,
            @Value("${app.cors.allowed-origins}") String allowedOrigins) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserDetailsService = customUserDetailsService;
        this.allowedOrigins = allowedOrigins;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/login/**", "/api/recuperar-senha/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()
                .requestMatchers(HttpMethod.GET,
                    "/api/campanhas/ativas",
                    "/api/noticias/**",
                    "/api/ranking",
                    "/api/beneficios",
                    "/api/beneficios/**",
                    "/api/locais-coleta/**",
                    "/api/tipos-materiais",
                    "/api/tipos-materiais/**",
                    "/api/avisos/ativo",
                    "/api/orientacoes/ativas",
                    "/api/empresas-recicladoras/**",
                    "/api/empresas-apoiadoras/aprovadas").permitAll()

                .requestMatchers(HttpMethod.GET, "/api/usuarios/me").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/usuarios/me").authenticated()

                .requestMatchers("/api/admin/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.GET, "/api/usuarios/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasAuthority("admin")
                .requestMatchers("/api/conteudo/**", "/api/estatisticas/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/avisos").hasAuthority("admin")
                .requestMatchers(HttpMethod.DELETE, "/api/avisos/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/campanhas", "/api/noticias", "/api/beneficios", "/api/tipos-materiais", "/api/orientacoes").hasAuthority("admin")
                .requestMatchers(HttpMethod.PUT, "/api/campanhas/**", "/api/noticias/**", "/api/beneficios/**", "/api/tipos-materiais/**", "/api/orientacoes/**").hasAuthority("admin")
                .requestMatchers("/api/locais-coleta/**", "/api/dias-horarios/**", "/api/materiais/**").hasAnyAuthority("admin", "recicladora")
                .requestMatchers("/api/solicitacoes/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/pontuacao/atribuir").hasAnyAuthority("admin", "recicladora")
                .requestMatchers("/api/pontuacao/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasAuthority("admin")

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
        configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList());
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
