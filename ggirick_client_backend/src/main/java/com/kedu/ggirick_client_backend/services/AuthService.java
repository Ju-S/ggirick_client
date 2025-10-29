package com.kedu.ggirick_client_backend.services;


import com.kedu.ggirick_client_backend.dao.AuthDAO;
import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthDAO authDAO;

    public UserTokenDTO getTokenInfo(String id) {
        return authDAO.getTokenInfo(id);
    }
}
