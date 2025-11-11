package br.com.ecologica.login.security;

import br.com.ecologica.login.service.CustomUserDetailsService;
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
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

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
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider()) 
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll() 
                .requestMatchers(HttpMethod.GET, "/api/campanhas/ativas").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/noticias").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/ranking").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/beneficios").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/locais-coleta").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/tipos-materiais").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/materiais").permitAll()
                .requestMatchers("/api/admin/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/campanhas").hasAuthority("admin")
                .requestMatchers(HttpMethod.PUT, "/api/campanhas/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.DELETE, "/api/campanhas/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/noticias").hasAuthority("admin")
                .requestMatchers(HttpMethod.PUT, "/api/noticias/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.DELETE, "/api_noticias/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/beneficios").hasAuthority("admin")
                .requestMatchers(HttpMethod.PUT, "/api/beneficios/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.DELETE, "/api/beneficios/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/locais-coleta").hasAuthority("admin")
                .requestMatchers(HttpMethod.PUT, "/api/locais-coleta/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.DELETE, "/api/locais-coleta/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/ranking").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/tipos-materiais").hasAuthority("admin")
                .requestMatchers(HttpMethod.PUT, "/api/tipos-materiais/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.DELETE, "/api/tipos-materiais/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/materiais").hasAuthority("admin")
                .requestMatchers(HttpMethod.PUT, "/api/materiais/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.DELETE, "/api/materiais/**").hasAuthority("admin")
                .anyRequest().authenticated()
            );

        return http.build();
    }
}