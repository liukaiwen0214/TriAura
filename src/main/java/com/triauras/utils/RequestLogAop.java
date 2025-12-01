package com.triauras.utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.UUID;

@Aspect
@Component
public class RequestLogAop {
    private static final Logger logger = LoggerFactory.getLogger(RequestLogAop.class);

    @Around("execution(* com.triauras.controller..*(..))")
    public Object logRequest(ProceedingJoinPoint joinPoint) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = null;
        if (attributes != null) {
            request = attributes.getRequest();
        }

        // 1. 生成请求ID
        String requestId = UUID.randomUUID().toString();
        MDC.put("requestId", requestId);

        // 2. 获取用户ID（从Session中）
        HttpSession session = null;
        if (request != null) {
            session = request.getSession(false);
        }
        String userId = session != null ? session.getAttribute("userId") + "" : "未登录";
        MDC.put("userId", userId);

        // 3. 接口名（类名+方法名）
        String apiName = joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName();
        MDC.put("apiName", apiName);

        // 4. 记录请求
        long startTime = System.currentTimeMillis();
        if (request != null) {
            logger.info("收到请求 | URL: {} | Method: {} | IP: {}",
                    request.getRequestURI(), request.getMethod(), request.getRemoteAddr());
        }

        // 执行方法
        Object result = joinPoint.proceed();

        // 记录响应
        long costTime = System.currentTimeMillis() - startTime;
        MDC.put("costTime", String.valueOf(costTime));
        logger.info("返回响应 | 耗时: {}ms", costTime);

        // 性能告警（超过1000ms打WARN日志）
        if (costTime > 1000) {
            LoggerFactory.getLogger("performance").warn("接口响应超时 | 接口: {} | 耗时: {}ms", apiName, costTime);
        }

        // 清除MDC
        MDC.clear();
        return result;
    }

}