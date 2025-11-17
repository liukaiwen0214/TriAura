package com.triauras.exception;

import com.triauras.vo.ResultVO;
import com.triauras.vo.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.stream.Collectors;

/**
 * 全局异常处理器
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * 处理参数校验异常
     */
    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResultVO<Void> handleValidationException(Exception ex, HttpServletRequest request) {
        String errorMessage = "参数校验失败";
        
        if (ex instanceof MethodArgumentNotValidException) {
            MethodArgumentNotValidException manvEx = (MethodArgumentNotValidException) ex;
            errorMessage = manvEx.getBindingResult().getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.joining(", "));
        } else if (ex instanceof BindException) {
            BindException bindEx = (BindException) ex;
            errorMessage = bindEx.getBindingResult().getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.joining(", "));
        }
        
        log.warn("参数校验失败 - URL: {}, 错误: {}", request.getRequestURI(), errorMessage);
        return ResultVO.error(ResultCode.BAD_REQUEST.getCode(), errorMessage);
    }
    
    /**
     * 处理约束违反异常
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResultVO<Void> handleConstraintViolationException(ConstraintViolationException ex, 
                                                            HttpServletRequest request) {
        String errorMessage = ex.getConstraintViolations().stream()
                .map(violation -> violation.getMessage())
                .collect(Collectors.joining(", "));
        
        log.warn("约束违反异常 - URL: {}, 错误: {}", request.getRequestURI(), errorMessage);
        return ResultVO.error(ResultCode.BAD_REQUEST.getCode(), errorMessage);
    }
    
    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResultVO<Void> handleBusinessException(BusinessException ex, HttpServletRequest request) {
        log.warn("业务异常 - URL: {}, 错误码: {}, 错误信息: {}", 
                request.getRequestURI(), ex.getCode(), ex.getMessage());
        return ResultVO.error(ex.getCode(), ex.getMessage());
    }
    
    /**
     * 处理运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResultVO<Void> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        log.error("运行时异常 - URL: {}, 错误: {}", request.getRequestURI(), ex.getMessage(), ex);
        return ResultVO.error(ResultCode.ERROR.getCode(), "系统繁忙，请稍后重试");
    }
    
    /**
     * 处理其他异常
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResultVO<Void> handleException(Exception ex, HttpServletRequest request) {
        log.error("系统异常 - URL: {}, 错误: {}", request.getRequestURI(), ex.getMessage(), ex);
        return ResultVO.error(ResultCode.ERROR.getCode(), "系统异常，请联系管理员");
    }
}