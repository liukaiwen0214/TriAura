package com.triauras.service;

import com.triauras.entity.Users;

public interface UsersService {
    /**
     * 根据用户名和密码哈希获取用户
     * @param username 用户名
     * @param password_hash 密码哈希
     * @return 用户实体
     */
    Users getUserByUsername(String username, String password_hash);
    /**
     * 更新用户密码
     * @param username 用户名
     * @param password_hash 当前密码哈希
     * @param newPassword 新密码
     * @return 是否更新成功
     */
    boolean updatePassword(String username, String password_hash, String newPassword);
     /**
      * 插入新用户
      * @param users 用户实体
      * @return 是否插入成功
      */
    boolean insertUser(Users users);
}
