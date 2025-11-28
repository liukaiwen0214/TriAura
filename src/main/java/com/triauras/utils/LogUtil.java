package com.triauras.utils;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Slf4j
public class LogUtil {
    
    private static final Logger PERFORMANCE_LOG = LoggerFactory.getLogger("performance");
    
    public static void logExecutionTime(String methodName, long startTime) {
        long executionTime = System.currentTimeMillis() - startTime;
        if (executionTime > 1000) {
            log.warn("方法 {} 执行时间过长: {}ms", methodName, executionTime);
        }
        PERFORMANCE_LOG.info("方法 {} 执行时间: {}ms", methodName, executionTime);
    }
    
    public static void logBusinessOperation(String operation, String operator, String details) {
        log.info("业务操作 - 操作类型: {}, 操作人: {}, 详情: {}", operation, operator, details);
    }
    
    public static void logSecurityEvent(String event, String user, String ip, String details) {
        log.warn("安全事件 - 事件类型: {}, 用户: {}, IP: {}, 详情: {}", event, user, ip, details);
    }
    
    public static void logException(String message, Throwable throwable) {
        log.error("{} - 异常信息: {}", message, throwable.getMessage(), throwable);
    }
}