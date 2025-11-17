package com.triauras.service.impl;

import com.triauras.entity.Users;
import com.triauras.mapper.UsersMapper;
import com.triauras.service.UsersService;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.logging.Logger;

@Service
public class UserServiceImpl implements UsersService {
    private final UsersMapper usersMapper;
    Logger logger = Logger.getLogger(this.getClass().getName());

    public UserServiceImpl(UsersMapper usersMapper) {
        this.usersMapper = usersMapper;
    }

    @Override
    public Users loginByEmail(String email, String password) {
        Users users = usersMapper.selectByEmail(email);
        if (users == null) {
            logger.log(java.util.logging.Level.INFO, "用户邮箱不存在");
            return null;
        }
        if (!users.getPassword().equals(password)) {
            logger.log(java.util.logging.Level.INFO, "用户密码错误");
            return null;
        }
        return users;
    }

    /**
     * 注册用户
     * @param users 用户实体 用户名、邮箱、密码
     * @return 插入影响的行数
     */
    @Override
    public String registerUser(Users users) {
        if (usersMapper.selectByUsername(users.getUsername()) != null) {
            logger.log(java.util.logging.Level.INFO, "用户名已存在");
            return "用户名已存在";
        }
        // 检查邮箱是否已存在
        if (usersMapper.selectByEmail(users.getEmail()) != null) {
            logger.log(java.util.logging.Level.INFO, "邮箱已存在");
            return "邮箱已存在";
        }
        // 插入新用户
        // 设置默认值
        users.setAvatar_url("https://example.com/default-avatar.jpg");
        users.setTimezone("Asia/Shanghai");
        users.setCurrency("CNY");
        users.setIs_active(true);
        users.setCreated_at(new Timestamp(System.currentTimeMillis()).toLocalDateTime());
        users.setUpdated_at(new Timestamp(System.currentTimeMillis()).toLocalDateTime());
        int rowsAffected = usersMapper.insertUser(users);
        if (rowsAffected == 0) {
            logger.log(java.util.logging.Level.INFO, "注册用户失败");
            return "注册失败，请稍后重试";
        }
        return "注册成功";
    }
}
