package com.triauras.service.impl;

import com.triauras.entity.Users;
import com.triauras.mapper.UsersMapper;
import com.triauras.service.UsersService;
import com.triauras.utils.PasswordEncoderUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

/**
 * 用户服务实现类
 * 负责用户登录、注册等核心业务逻辑
 */
@Slf4j
@Service
public class UserServiceImpl implements UsersService {
    private final UsersMapper usersMapper;

    /**
     * 构造函数，依赖注入用户映射器
     *
     * @param usersMapper 用户数据访问对象
     */
    public UserServiceImpl(UsersMapper usersMapper) {
        this.usersMapper = usersMapper;
    }

    /**
     * 通过邮箱和密码登录
     *
     * @param email    用户邮箱
     * @param password 用户密码
     * @return 登录成功返回用户对象，失败返回null
     */
    @Override
    public Users loginByEmail(String email, String password) {
        log.info("【业务处理】用户登录, email: {}", email);
        // 根据邮箱查询用户
        Users users = usersMapper.selectByEmail(email);
        // 检查用户是否存在
        if (users == null) {
            log.warn("用户登录失败 - 邮箱: {}", email);
            return null;
        }
        if (!PasswordEncoderUtil.matches(password, users.getPassword())) {
            log.warn("密码验证失败 - 邮箱: {}", email);
            return null;
        }

        // 更新最后登录时间
        users.setLast_login_at(new java.sql.Timestamp(System.currentTimeMillis()));
        usersMapper.updateLastLoginTime(users.getId(), users.getLast_login_at());
        log.info("用户登录成功 - 用户ID: {}, 用户名: {}", users.getId(), users.getUsername());
        return users;

    }

    /**
     * 注册新用户
     *
     * @param users 用户注册信息
     * @return 注册结果消息
     */
    @Override
    public String registerUser(Users users) {
        // 检查用户名是否已存在
        if (usersMapper.selectByUsername(users.getUsername()) != null) {
            // log.info("用户名已存在");
            return "用户名已存在";
        }

        // 检查邮箱是否已存在
        if (usersMapper.selectByEmail(users.getEmail()) != null) {
            // log.info("邮箱已存在");
            return "邮箱已存在";
        }
// 对密码进行加密
        String encodedPassword = PasswordEncoderUtil.encode(users.getPassword());
        users.setPassword(encodedPassword);
        // 设置默认值
        users.setAvatar_url("https://example.com/default-avatar.jpg");
        users.setTimezone("Asia/Beijing");
        users.setCurrency("CNY");
        users.setIs_active(true);
        users.setCreated_at(new Timestamp(System.currentTimeMillis()).toLocalDateTime());
        users.setUpdated_at(new Timestamp(System.currentTimeMillis()).toLocalDateTime());

        // 插入用户数据
        int result = usersMapper.insertUser(users);
        if (result > 0) {
            log.info("用户注册成功 - 用户ID: {}, 用户名: {}", users.getId(), users.getUsername());
            return "注册成功";
        } else {
            log.error("用户注册失败 - 用户名: {}, 邮箱: {}", users.getUsername(), users.getEmail());
            return "注册失败";
        }
    }
}