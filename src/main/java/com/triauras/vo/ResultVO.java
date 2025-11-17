package com.triauras.vo;

import lombok.Data;
import java.io.Serializable;

/**
 * 统一响应结果封装类
 */
@Data
public class ResultVO<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * 状态码
     */
    private Integer code;
    
    /**
     * 响应消息
     */
    private String message;
    
    /**
     * 响应数据
     */
    private T data;
    
    /**
     * 时间戳
     */
    private Long timestamp;
    
    /**
     * 成功响应（无数据）
     */
    public static <T> ResultVO<T> success() {
        return success(null);
    }
    
    /**
     * 成功响应（有数据）
     */
    public static <T> ResultVO<T> success(T data) {
        ResultVO<T> result = new ResultVO<>();
        result.setCode(ResultCode.SUCCESS.getCode());
        result.setMessage(ResultCode.SUCCESS.getMessage());
        result.setData(data);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }
    
    /**
     * 失败响应
     */
    public static <T> ResultVO<T> error(Integer code, String message) {
        ResultVO<T> result = new ResultVO<>();
        result.setCode(code);
        result.setMessage(message);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }
    
    /**
     * 失败响应（使用预定义错误码）
     */
    public static <T> ResultVO<T> error(ResultCode resultCode) {
        return error(resultCode.getCode(), resultCode.getMessage());
    }
    
    /**
     * 失败响应（默认错误码）
     */
    public static <T> ResultVO<T> error(String message) {
        return error(ResultCode.ERROR.getCode(), message);
    }
}