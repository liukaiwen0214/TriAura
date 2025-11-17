package com.triauras.entity;

import lombok.Data;

@Data
public class Users {
    /**
     * 用户ID
     */
    private Long id;
    /**
     * 用户名
     */
    private String username;
    /**
     * 邮箱
     */
    private String email;
    /**
     * 密码哈希
     */
    private String password;
    /**
     * 头像URL
     */
    private String avatar_url;
    /**
     * 时区
     */
    private String timezone;
    /**
     * 货币
     */
    private String currency;
    /**
     * 创建时间
     */
    private java.sql.Timestamp created_at;
    /**
     * 更新时间
     */
    private java.sql.Timestamp updated_at;
    /**
     * 最后登录时间
     */
    private java.sql.Timestamp last_login_at;
    /**
     * 是否激活
     */
    private Boolean is_active;
}