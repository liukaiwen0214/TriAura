package com.triauras.service.impl;

import com.aliyuncs.exceptions.ClientException;
import com.triauras.entity.Users;
import com.triauras.mapper.UsersMapper;
import com.triauras.service.UsersService;
import com.triauras.utils.OSSUtil;

import org.springframework.stereotype.Service;

import java.sql.Timestamp;

/**
 * 用户服务实现类
 * 负责用户登录、注册等核心业务逻辑
 */
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
        // log.debug("【业务处理】用户登录, email: {}",email);
        // 根据邮箱查询用户
        Users users = usersMapper.selectByEmail(email);
        // 初始化OSS图片工具，用于获取头像URL
        OSSUtil ossUtil = new OSSUtil(
                "https://oss-cn-beijing.aliyuncs.com",
                "cn-beijing",
                "triaura",
                "Avatar/" + users.getAvatar_url()
        );
        String avatarUrl;
        try {
            // 获取OSS预签名URL
            avatarUrl = ossUtil.getImageUrl();
        } catch (ClientException e) {
            throw new RuntimeException(e);
        }
        // 更新用户头像URL
        users.setAvatar_url(avatarUrl);
        // 验证密码
        if (!users.getPassword().equals(password)) {
            // log.info("用户密码错误");
            return null;
        }
        // 更新最后登录时间
        // log.debug("【业务完成】用户登录, email: {}", email);
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
        
        // 设置默认值
        users.setAvatar_url("https://example.com/default-avatar.jpg");
        users.setTimezone("Asia/Shanghai");
        users.setCurrency("CNY");
        users.setIs_active(true);
        users.setCreated_at(new Timestamp(System.currentTimeMillis()).toLocalDateTime());
        users.setUpdated_at(new Timestamp(System.currentTimeMillis()).toLocalDateTime());
        
        // 插入用户数据
        int rowsAffected = usersMapper.insertUser(users);
        if (rowsAffected == 0) {
            // log.info("注册用户失败");
            return "注册失败，请稍后重试";
        }
        // log.debug("【业务完成】用户注册, email: {}", users.getEmail());
        return "注册成功";
    }
}
