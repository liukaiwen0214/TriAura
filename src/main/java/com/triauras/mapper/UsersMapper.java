package com.triauras.mapper;

import com.triauras.entity.UsersEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UsersMapper {
    /**
     * 根据用户名和密码哈希获取用户
     * @param username 用户名
     * @param password_hash 密码哈希
     * @return 用户实体
     */
    UsersEntity getUserByUsername(@Param("username") String username, @Param("password_hash") String password_hash);
    /**
     * 更新用户密码
     * @param username 用户名
     * @param password_hash 当前密码哈希
     * @param newPassword 新密码
     * @return 更新影响的行数
     */
    int updatePassword(@Param("username") String username, @Param("password_hash") String password_hash, @Param("newPassword") String newPassword);
     /**
     * 插入新用户
     * @param usersEntity 用户实体
     * @return 插入影响的行数
     */
    int insertUser(UsersEntity usersEntity);
    /**
     * 根据用户名获取用户
     * @param username 用户名
     * @return 用户实体
     */
    UsersEntity getUserByUserName(String username);
    /**
     * 根据邮箱获取用户
     * @param email 邮箱
     * @return 用户实体
     */
    UsersEntity getUserByEmail(String email);
}
