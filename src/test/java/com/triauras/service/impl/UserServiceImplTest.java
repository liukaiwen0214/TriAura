package com.triauras.service.impl;

import com.triauras.entity.Users;
import com.triauras.mapper.UsersMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.ContextConfiguration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.util.Date;


@ExtendWith(SpringExtension.class)
@ContextConfiguration(locations = {"classpath:/config/applicationContext.xml", "classpath:/config/springmvc-servlet.xml"})
class UserServiceImplTest {
    @Autowired
    private UsersMapper usersMapper;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final Logger logger = LoggerFactory.getLogger(UserServiceImplTest.class.getName());

    @Test
    void getUserByUsername() {
        // 准备已知用户数据或在测试前插入测试用户
        String username = "liukaiwen";  // 假设数据库中有这个用户
        String password = "123456";     // 假设这是用户的真实密码

        // 先根据用户名获取用户
        Users user = usersMapper.getUserByUserName(username);
        if(user != null) {
            System.out.println("根据用户名查询到用户: " + user.getUsername());
        } else {
            System.out.println("根据用户名未查询到用户: " + username);
        }
        // 验证密码是否匹配
        boolean matches = passwordEncoder.matches(password, user.getPassword_hash());
        if (matches) {
            System.out.println("密码验证成功");
        } else {
            System.out.println("密码验证失败");
        }
    }

    @Test
    void updatePassword() {

    }

    /**
     * 测试插入用户
     */
    @Test
    void insertUser() {
        // 测试数据
        Users user = new Users();
        user.setUsername("liukaiwen");
        user.setPassword_hash(passwordEncoder.encode("123456"));
        user.setEmail("lkwyouxiang@126.com");
        user.setAvatar_url("https://example.com/avatar.jpg");
        user.setTimezone("Asia/Shanghai");
        user.setCurrency("CNY");
        user.setCreated_at(new Timestamp(new Date().getTime()));
        user.setUpdated_at(new Timestamp(new Date().getTime()));

        // 调用插入方法
        int result = usersMapper.insertUser(user);

        if (result == 1) {
            System.out.println("insert user success"+user.getUsername());
        }else {
            System.out.println("insert user failed");
        }
    }
}