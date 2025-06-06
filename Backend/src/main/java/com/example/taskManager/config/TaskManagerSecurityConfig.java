package com.example.taskManager.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.example.taskManager.jwt.JwtAuthenticationFilter;
import com.example.taskManager.jwt.OAuth2LoginSuccessHandler;
import com.example.taskManager.repository.UserRepository;
import com.example.taskManager.service.CustomOAuth2UserService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class TaskManagerSecurityConfig {
	private final UserDetailsService userDetailsService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final UserRepository userRepository;
	private CustomOAuth2UserService customOAuth2UserService;
	private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

	@Autowired
	public TaskManagerSecurityConfig(UserDetailsService userDetailsService,
			JwtAuthenticationFilter jwtAuthenticationFilter, UserRepository userRepository,
			CustomOAuth2UserService customOAuth2UserService, OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler) {
		this.userDetailsService = userDetailsService;
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.userRepository = userRepository;
		this.customOAuth2UserService = customOAuth2UserService;
		this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors().and().csrf().disable()
				.authorizeHttpRequests()
				.requestMatchers("/user/signup", "/user/signin", "/user/verify/{email}", "/user/reset-password",
						"/api/otp/send", "/api/otp/verify**", "/static/**", "/public/**", "/oauth2/**", "/login/oauth2/**")
				.permitAll()
				.requestMatchers("/user/profile")
				.authenticated()
				.anyRequest().authenticated()
				.and()
				.oauth2Login(oauth2 -> oauth2
					    .userInfoEndpoint(userInfo -> 
					        userInfo.userService(customOAuth2UserService)
					    )
					    .successHandler(oAuth2LoginSuccessHandler)
					)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration builder) throws Exception {
		return builder.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("http://localhost/5173", "http://localhost:3000",
								"https://task-manager-snowy-nine.vercel.app/", "https://infinite-api-lovat.vercel.app/")
						.allowedMethods("GET", "POST", "PUT", "DELETE").allowedHeaders("*").allowCredentials(true);
			}
		};
	}
}
