package com.triauras.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 响应码枚举类
 * 定义系统中所有API接口的响应码和响应消息
 */
@Getter
@AllArgsConstructor
public enum ResultCode {
    
    /**
     * 成功响应码
     */
    SUCCESS(200, "操作成功"),
    
    /**
     * 客户端错误响应码
     */
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未授权访问"),
    FORBIDDEN(403, "禁止访问"),
    NOT_FOUND(404, "资源不存在"),
    
    /**
     * 服务器错误响应码
     */
    ERROR(500, "服务器内部错误"),
    SERVICE_UNAVAILABLE(503, "服务不可用"),
    
    /**
     * 业务错误响应码
     */
    USER_NOT_EXIST(1001, "用户不存在"),
    USER_EXISTS(1002, "用户已存在"),
    PASSWORD_ERROR(1003, "密码错误"),
    LOGIN_EXPIRED(1004, "登录已过期");
    
    /**
     * 响应码
     */
    private final Integer code;
    
    /**
     * 响应消息
     */
    private final String message;
}