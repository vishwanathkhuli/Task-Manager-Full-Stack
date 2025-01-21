package com.example.taskManager.jwt;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtAuthenticationHelper {

    private final String secret = "vishwanathkkhuli19012001mangalwadhaliyalkarnatakaisaverysecureandlongkey"; // Secret key
    
    private static final long JWT_TOKEN_VALIDITY = 7 * 24 * 60 * 60; // 7 days in seconds
    
    private static final long REFRESH_TOKEN_VALIDITY = 7 * 24 * 60 * 60; // 7 days for refresh token validity

    // Extract email (username) from token
    public String getUsernameFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getSubject();  // The email is stored in subject
    }
    
    // Extract userId from token
    public String getUserIdFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("userId", String.class);  // Extract userId from the claims
    }

    // Parse token to get claims
    public Claims getClaimsFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secret.getBytes())  // Use the signing key
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims;
    }
    
    // Check if the token has expired
    public boolean isTokenExpired(String token) {
        Claims claims = getClaimsFromToken(token);
        Date expDate = claims.getExpiration();
        return expDate.before(new Date());
    }

    // Generate JWT Token using email and userId
    public String generateToken(String email, String userId) {
        Map<String, Object> claims = new HashMap<>();
        
        // Add the userId and email to the claims
        claims.put("userId", userId);  // Add userId to the claims
        claims.put("email", email);  // Add email to the claims

        // Generate token using email and userId as claims
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email) // Email as the subject
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
                .signWith(new SecretKeySpec(secret.getBytes(), SignatureAlgorithm.HS512.getJcaName()), SignatureAlgorithm.HS512)
                .compact();
    }

    // Generate refresh token with email and userId
    public String generateRefreshToken(String email, String userId) {
        Map<String, Object> claims = new HashMap<>();
        
        // Add the userId and email to the claims
        claims.put("userId", userId);  // Add userId to the claims
        claims.put("email", email);  // Add email to the claims

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email) // Email as the subject
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDITY * 1000))
                .signWith(new SecretKeySpec(secret.getBytes(), SignatureAlgorithm.HS512.getJcaName()), SignatureAlgorithm.HS512)
                .compact();
    }

    // Check if the token is valid
    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(secret.getBytes())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false; // Token is invalid if an exception is thrown
        }
    }
}
