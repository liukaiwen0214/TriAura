package com.triauras.service;

import com.triauras.entity.Users;

public interface UsersService {
    Users loginByEmail(String email, String password);
    String registerUser(Users users);
}
