package com.triauras.mapper;

import com.triauras.entity.Users;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UsersMapper{

    /**
     * 根据用户邮箱和密码哈希获取用户
     * @param email 用户邮箱
     * @param password 密码哈希
     * @return 用户实体
     */
    Users loginByEmail(@Param("email") String email, @Param("password") String password);
    /**
     * 根据邮箱查找用户
     * @param email 用户邮箱
     * @return 用户实体
     */
    Users selectByEmail(@Param("email") String email);
    /**
     * 插入新用户
     * @param users 用户实体
     * @return 插入影响的行数
     */
    int insertUser(Users users);
    Users selectByUsername(@Param("username") String username);
}
