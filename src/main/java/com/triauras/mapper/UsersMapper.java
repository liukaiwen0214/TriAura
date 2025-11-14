package com.triauras.mapper;

import com.triauras.entity.Users;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UsersMapper {
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
     * @param password_hash 新密码哈希
     * @return 更新影响的行数
     */
    int updatePassword(String username, String password_hash, String newPassword);
     /**
     * 插入新用户
     * @param users 用户实体
     * @return 插入影响的行数
     */
    int insertUser(Users users);

    Users getUserByUserName(String username);

    Users getUserByEmail(String email);
}
