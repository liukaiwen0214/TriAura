package com.triauras.service.impl;

import com.triauras.entity.Users;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;


@ExtendWith(SpringExtension.class)
@ContextConfiguration(locations = {"classpath:/config/applicationContext.xml", "classpath:/config/springmvc-servlet.xml"})
class UserServiceImplTest {
    @Autowired
    private UserServiceImpl userServiceImpl;

    @Test
    void loginByEmail() {
        Users users = userServiceImpl.loginByEmail("admin@example.com", "password123");
        assertEquals("admin", users.getUsername());
    }

    @Test
    void registerUser() {
        Users users = new Users();
        users.setEmail("admin@example.com");
        users.setPassword("password123");
        users.setUsername("admin");
        users.setAvatar_url("https://example.com/avatar.jpg");
        users.setCreated_at(LocalDateTime.now());
        users.setUpdated_at(LocalDateTime.now());
        String result = userServiceImpl.registerUser(users);
        assertEquals("注册成功", result);
    }
}