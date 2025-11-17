package com.triauras.service.impl;

import com.triauras.entity.Users;
import com.triauras.mapper.UsersMapper;
import com.triauras.service.UsersService;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.ContextConfiguration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;



@ExtendWith(SpringExtension.class)
@ContextConfiguration(locations = {"classpath:/config/applicationContext.xml", "classpath:/config/springmvc-servlet.xml"})
class UsersServiceImplTest {
    private final Logger logger = LoggerFactory.getLogger(UsersServiceImplTest.class.getName());
    @Autowired
    private UsersService usersService;

    /**
     * 测试登陆功能
     */
    @Test
    void loginByEmail() {
        // 准备测试数据
        String email = "lkwyouxiang@126.com";
        String password = "12345678";
        // 执行测试
        Users users = usersService.loginByEmail(email, password);
        logger.info(users.toString());
        // 验证结果
        assertNotNull(users);
        assertEquals(email, users.getEmail());
        System.out.println(users);
    }
}