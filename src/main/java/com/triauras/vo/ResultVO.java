package com.triauras.vo;

import lombok.Data;
import java.io.Serializable;

/**
 * 统一响应结果封装类
 * 用于封装API接口的响应结果，包括成功和失败的情况
 *
 * @param <T> 响应数据的类型
 */
@Data
public class ResultVO<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * 响应码
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
     * 响应时间戳
     */
    private Long timestamp;
    
    /**
     * 成功响应，无数据
     *
     * @param <T> 响应数据类型
     * @return 成功响应对象
     */
    public static <T> ResultVO<T> success() {
        return success(null);
    }
    
    /**
     * 成功响应，带数据
     *
     * @param data 响应数据
     * @param <T>  响应数据类型
     * @return 成功响应对象
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
     * 错误响应，带错误码和错误信息
     *
     * @param code    错误码
     * @param message 错误信息
     * @param <T>     响应数据类型
     * @return 错误响应对象
     */
    public static <T> ResultVO<T> error(Integer code, String message) {
        ResultVO<T> result = new ResultVO<>();
        result.setCode(code);
        result.setMessage(message);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }
    
    /**
     * 错误响应，使用ResultCode枚举
     *
     * @param resultCode 响应码枚举
     * @param <T>        响应数据类型
     * @return 错误响应对象
     */
    public static <T> ResultVO<T> error(ResultCode resultCode) {
        return error(resultCode.getCode(), resultCode.getMessage());
    }
    
    /**
     * 错误响应，只带错误信息，默认错误码
     *
     * @param message 错误信息
     * @param <T>     响应数据类型
     * @return 错误响应对象
     */
    public static <T> ResultVO<T> error(String message) {
        return error(ResultCode.ERROR.getCode(), message);
    }
}