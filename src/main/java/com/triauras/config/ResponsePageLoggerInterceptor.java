package com.triauras.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
public class ResponsePageLoggerInterceptor implements HandlerInterceptor {

    /**
     * 请求处理完成后（视图渲染完毕）执行
     *
     * @param request  必非空（HTTP请求对象）
     * @param response 必非空（HTTP响应对象）
     * @param handler  可能为空（处理器对象，如Controller方法）
     * @param ex       可能为空（请求处理中抛出的异常）
     */
    @Override
    public void afterCompletion(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @Nullable Object handler,
            @Nullable Exception ex
    ) {
        // 1. 获取核心信息
        String requestUrl = request.getRequestURI(); // 请求URL（如 /home/index）
        int status = response.getStatus(); // 响应状态码（如 200）
        String viewName = null;

        // 2. 获取视图名（从请求属性中取 postHandle 存储的 ModelAndView）
        if (handler != null) {
            ModelAndView mv = (ModelAndView) request.getAttribute("CURRENT_MODEL_AND_VIEW");
            if (mv != null) {
                viewName = mv.getViewName(); // 视图名（如 index、user/list）
            }
        }

        // ########## 核心修改：日志内容改为中文 ##########
        log.debug("响应状态：{} OK | 请求URL：{} | 视图名（页面）：{}",
                status, requestUrl, viewName == null ? "无（JSON/静态资源）" : viewName);
    }

    /**
     * 处理器处理完请求后（视图渲染前）执行：存储 ModelAndView 到请求属性
     *
     * @param request      必非空
     * @param response     必非空
     * @param handler      可能为空
     * @param modelAndView 可能为空（包含视图名和模型数据）
     */
    @Override
    public void postHandle(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @Nullable Object handler,
            @Nullable ModelAndView modelAndView
    ) {
        if (modelAndView != null) {
            request.setAttribute("CURRENT_MODEL_AND_VIEW", modelAndView);
        }
    }

    /**
     * 请求处理前执行（可选：如需MDC上下文可添加，此处仅占位）
     *
     * @param request  必非空
     * @param response 必非空
     * @param handler  可能为空
     * @return true=继续执行后续流程，false=中断
     */
    @Override
    public boolean preHandle(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @Nullable Object handler
    ) {
        return true; // 返回true才会继续执行后续拦截器/Controller
    }
}
