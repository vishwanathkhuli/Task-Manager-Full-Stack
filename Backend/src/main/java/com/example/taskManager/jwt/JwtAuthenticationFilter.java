package com.example.taskManager.jwt;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    JwtAuthenticationHelper jwtHelper;

    @Autowired
    UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Get the request header
        String requestHeader = request.getHeader("Authorization");
        String username = null;
        String token = null;
        String userId = null; // Declare userId

        // Check if the Authorization header is present and starts with "Bearer"
        if (requestHeader != null && requestHeader.startsWith("Bearer ")) {
            token = requestHeader.substring(7);  // Get token without "Bearer " prefix
            username = jwtHelper.getUsernameFromToken(token);  // Extract username (email)
            userId = jwtHelper.getUserIdFromToken(token);  // Extract userId from the token

            // Validate token and check if user details are not null
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Check if the token is valid
                if (userDetails != null && !jwtHelper.isTokenExpired(token)) {
                    // Create authentication token
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set the authentication in the security context
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

                    // You can now use the userId to fetch user-specific data if needed
                    System.out.println("Authenticated User ID: " + userId); // For debugging purposes
                }
            }
        }

        // Proceed with the filter chain
        filterChain.doFilter(request, response);
    }
}
