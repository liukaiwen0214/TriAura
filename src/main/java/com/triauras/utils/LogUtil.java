package com.triauras.utils;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 日志工具类
 * 提供统一的日志记录方法，包括性能日志、业务操作日志、安全事件日志和异常日志
 */
@Slf4j
public class LogUtil {
    
    /**
     * 性能日志记录器
     */
    private static final Logger PERFORMANCE_LOG = LoggerFactory.getLogger("performance");
    
    /**
     * 记录方法执行时间
     *
     * @param methodName 方法名称
     * @param startTime  方法开始执行时间戳
     */
    public static void logExecutionTime(String methodName, long startTime) {
        long executionTime = System.currentTimeMillis() - startTime;
        // 执行时间超过1秒时记录警告日志
        if (executionTime > 1000) {
            log.warn("方法 {} 执行时间过长: {}ms", methodName, executionTime);
        }
        // 记录性能日志
        PERFORMANCE_LOG.info("方法 {} 执行时间: {}ms", methodName, executionTime);
    }
    
    /**
     * 记录业务操作日志
     *
     * @param operation 操作类型
     * @param operator  操作人
     * @param details   操作详情
     */
    public static void logBusinessOperation(String operation, String operator, String details) {
        log.info("业务操作 - 操作类型: {}, 操作人: {}, 详情: {}", operation, operator, details);
    }
    
    /**
     * 记录安全事件日志
     *
     * @param event   事件类型
     * @param user    相关用户
     * @param ip      IP地址
     * @param details 事件详情
     */
    public static void logSecurityEvent(String event, String user, String ip, String details) {
        log.warn("安全事件 - 事件类型: {}, 用户: {}, IP: {}, 详情: {}", event, user, ip, details);
    }
    
    /**
     * 记录异常日志
     *
     * @param message   异常描述
     * @param throwable 异常对象
     */
    public static void logException(String message, Throwable throwable) {
        log.error("{} - 异常信息: {}", message, throwable.getMessage(), throwable);
    }
}