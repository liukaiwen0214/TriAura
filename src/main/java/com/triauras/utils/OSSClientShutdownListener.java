package com.triauras.utils;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import lombok.extern.slf4j.Slf4j;

/**
 * 应用停止时关闭 OSS 单例客户端
 */
@WebListener
@Slf4j
public class OSSClientShutdownListener implements ServletContextListener {

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // 调用 OSSUtil 的静态方法关闭单例客户端
        OSSUtil.shutdownSingletonClient();
        log.info("应用停止，已关闭 OSS 单例客户端");
    }
}