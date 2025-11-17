package com.triauras.util;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 日志工具类
 */
@Slf4j
public class LogUtil {
    
    private static final Logger PERFORMANCE_LOG = LoggerFactory.getLogger("performance");
    
    /**
     * 记录方法执行时间
     */
    public static void logExecutionTime(String methodName, long startTime) {
        long executionTime = System.currentTimeMillis() - startTime;
        if (executionTime > 1000) {
            log.warn("方法 {} 执行时间过长: {}ms", methodName, executionTime);
        }
        PERFORMANCE_LOG.info("方法 {} 执行时间: {}ms", methodName, executionTime);
    }
    
    /**
     * 记录业务操作日志
     */
    public static void logBusinessOperation(String operation, String operator, String details) {
        log.info("业务操作 - 操作类型: {}, 操作人: {}, 详情: {}", operation, operator, details);
    }
    
    /**
     * 记录安全相关日志
     */
    public static void logSecurityEvent(String event, String user, String ip, String details) {
        log.warn("安全事件 - 事件类型: {}, 用户: {}, IP: {}, 详情: {}", event, user, ip, details);
    }
    
    /**
     * 记录异常堆栈信息
     */
    public static void logException(String message, Throwable throwable) {
        log.error("{} - 异常信息: {}", message, throwable.getMessage(), throwable);
    }
}