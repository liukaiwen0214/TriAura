package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class Users extends BaseEntity {
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 邮箱
     */
    private String email;
    
    /**
     * 密码
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
     * 最后登录时间
     */
    private java.sql.Timestamp last_login_at;
    
    /**
     * 是否激活
     */
    private Boolean is_active;
}