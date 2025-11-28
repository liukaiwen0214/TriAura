package com.triauras.exception;

import lombok.Getter;

/**
 * 业务异常类
 * 用于处理业务逻辑中的异常情况，包含错误码和错误信息
 */
@Getter
public class BusinessException extends RuntimeException {
    
    /**
     * 错误码
     */
    private final Integer code;
    
    /**
     * 构造函数，包含错误码和错误信息
     *
     * @param code    错误码
     * @param message 错误信息
     */
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
    
    /**
     * 构造函数，只包含错误信息，默认错误码为500
     *
     * @param message 错误信息
     */
    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }
    
    /**
     * 构造函数，包含错误码、错误信息和异常原因
     *
     * @param code    错误码
     * @param message 错误信息
     * @param cause   异常原因
     */
    public BusinessException(Integer code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }
}