package com.triauras.vo;

import lombok.Data;
import java.io.Serializable;

@Data
public class ResultVO<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    private Integer code;
    
    private String message;
    
    private T data;
    
    private Long timestamp;
    
    public static <T> ResultVO<T> success() {
        return success(null);
    }
    
    public static <T> ResultVO<T> success(T data) {
        ResultVO<T> result = new ResultVO<>();
        result.setCode(ResultCode.SUCCESS.getCode());
        result.setMessage(ResultCode.SUCCESS.getMessage());
        result.setData(data);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }
    
    public static <T> ResultVO<T> error(Integer code, String message) {
        ResultVO<T> result = new ResultVO<>();
        result.setCode(code);
        result.setMessage(message);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }
    
    public static <T> ResultVO<T> error(ResultCode resultCode) {
        return error(resultCode.getCode(), resultCode.getMessage());
    }
    
    public static <T> ResultVO<T> error(String message) {
        return error(ResultCode.ERROR.getCode(), message);
    }
}