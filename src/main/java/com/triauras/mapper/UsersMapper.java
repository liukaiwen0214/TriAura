package com.triauras.mapper;

import com.triauras.entity.Users;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.sql.Timestamp;

@Mapper
public interface UsersMapper {

    Users loginByEmail(@Param("email") String email, @Param("password") String password);
    
    Users selectByEmail(@Param("email") String email);
    
    Users selectByUsername(@Param("username") String username);
    
    int insertUser(Users users);

    void updateLastLoginTime(Long id, Timestamp lastLoginAt);
}