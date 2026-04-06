package com.foodexpress.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .authorizeExchange(exchanges ->
                exchanges
                    .pathMatchers("/actuator/health/**").permitAll()
                    .pathMatchers("/api/v1/users/health").permitAll()
                    .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/restaurants/**").permitAll()
                    .pathMatchers(HttpMethod.POST, "/api/restaurants/**").permitAll()
                    .pathMatchers(HttpMethod.PUT, "/api/restaurants/**").permitAll()
                    .pathMatchers(HttpMethod.DELETE, "/api/restaurants/**").permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/promotions/**").permitAll()
                    .pathMatchers(HttpMethod.POST, "/api/promotions/**").permitAll()
                    .pathMatchers(HttpMethod.PUT, "/api/promotions/**").permitAll()
                    .pathMatchers(HttpMethod.DELETE, "/api/promotions/**").permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/menus/**").permitAll()
                    .pathMatchers(HttpMethod.POST, "/api/menus/**").permitAll()
                    .pathMatchers(HttpMethod.PUT, "/api/menus/**").permitAll()
                    .pathMatchers(HttpMethod.PATCH, "/api/menus/**").permitAll()
                    .pathMatchers(HttpMethod.DELETE, "/api/menus/**").permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/deliveries/**").permitAll()
                    .pathMatchers(HttpMethod.POST, "/api/deliveries/**").permitAll()
                    .pathMatchers(HttpMethod.PUT, "/api/deliveries/**").permitAll()
                    .pathMatchers(HttpMethod.DELETE, "/api/deliveries/**").permitAll()
                    .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwt -> {})
            )
            .csrf().disable()
            .cors().and();

        return http.build();
    }
}
