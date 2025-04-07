package com.example.taskManager.jwt;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import com.example.taskManager.model.User;
import com.example.taskManager.repository.UserRepository;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtAuthenticationHelper jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String token = jwtService.generateToken(user.getEmail(), user.getId().toString());

            // ✅ Redirect to frontend (deployed version) with token
            response.sendRedirect("https://task-manager-snowy-nine.vercel.app/oauth2-redirect?token=" + token);
        } else {
            // ❌ Error redirect for frontend (deployed version)
            response.sendRedirect("https://task-manager-snowy-nine.vercel.app/signin?error=user_not_found");
        }
    }
}
