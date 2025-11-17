package com.triauras.service;

import com.triauras.entity.Users;

public interface UsersService {
    /**
     * 根据邮箱密码登陆
     *
     * @param email         用户邮箱
     * @param password 密码哈希
     * @return 用户实体
     */
    Users loginByEmail(String email, String password);
        /**
     * 注册用户
     * @param users 用户实体
     * @return 插入影响的行数
     */
    String registerUser(Users users);
}
