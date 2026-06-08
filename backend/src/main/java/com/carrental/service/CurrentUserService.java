package com.carrental.service;

import com.carrental.domain.User;
import com.carrental.security.AppUserDetails;
import com.carrental.web.ApiException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    public User require() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AppUserDetails details) {
            return details.getUser();
        }
        throw ApiException.forbidden("Not authenticated");
    }
}
