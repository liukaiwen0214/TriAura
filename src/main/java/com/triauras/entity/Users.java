package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class Users extends BaseEntity {
    private String username;
    
    private String email;
    
    private String password;
    
    private String avatar_url;
    
    private String timezone;
    
    private String currency;
    
    private java.sql.Timestamp last_login_at;
    
    private Boolean is_active;
}