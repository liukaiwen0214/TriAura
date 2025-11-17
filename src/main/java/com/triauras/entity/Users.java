package com.triauras.entity;

import java.sql.Timestamp;


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


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAvatar_url() {
        return avatar_url;
    }

    public void setAvatar_url(String avatar_url) {
        this.avatar_url = avatar_url;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public Timestamp getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(Timestamp updated_at) {
        this.updated_at = updated_at;
    }

    public Timestamp getLast_login_at() {
        return last_login_at;
    }

    public void setLast_login_at(Timestamp last_login_at) {
        this.last_login_at = last_login_at;
    }

    public Boolean getIs_active() {
        return is_active;
    }

    public void setIs_active(Boolean is_active) {
        this.is_active = is_active;
    }

    public Users(Long id, String username, String email, String password, String avatar_url, String timezone, String currency, Timestamp created_at, Timestamp updated_at, Timestamp last_login_at, Boolean is_active) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatar_url = avatar_url;
        this.timezone = timezone;
        this.currency = currency;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.last_login_at = last_login_at;
        this.is_active = is_active;
    }

    public Users(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public Users() {

    }

    @Override
    public String toString() {
        return "Users{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", avatar_url='" + avatar_url + '\'' +
                ", timezone='" + timezone + '\'' +
                ", currency='" + currency + '\'' +
                ", created_at=" + created_at +
                ", updated_at=" + updated_at +
                ", last_login_at=" + last_login_at +
                ", is_active=" + is_active +
                '}';
    }
}
