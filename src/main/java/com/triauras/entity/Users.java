package com.triauras.entity;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户实体类
 * 存储系统用户的基本信息
 */
@Data
public class Users {

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 创建时间
     */
    private LocalDateTime created_at;

    /**
     * 用户名
     */
    private String username;
    
    /**
     * 用户邮箱
     */
    private String email;
    
    /**
     * 用户密码（加密存储）
     */
    private String password;
    
    /**
     * 用户头像URL
     */
    private String avatar_url;
    
    /**
     * 用户时区
     */
    private String timezone;
    
    /**
     * 用户货币类型
     */
    private String currency;
    
    /**
     * 最后登录时间
     */
    private java.sql.Timestamp last_login_at;
    
    /**
     * 用户是否激活
     */
    private Boolean is_active;

    /**
     * 更新时间
     */
    private LocalDateTime updated_at;
}