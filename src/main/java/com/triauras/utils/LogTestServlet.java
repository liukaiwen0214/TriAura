package com.triauras.utils;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@WebServlet("/test-log")
public class LogTestServlet extends HttpServlet {
    private static final Logger logger = LoggerFactory.getLogger(LogTestServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");

        logger.trace("TRACE级别日志 - Servlet测试");
        logger.debug("DEBUG级别日志 - Servlet测试");
        logger.info("INFO级别日志 - Servlet测试");
        logger.warn("WARN级别日志 - Servlet测试");
        logger.error("ERROR级别日志 - Servlet测试");

        resp.getWriter().println("日志测试完成，请检查Tomcat日志输出");
    }
}