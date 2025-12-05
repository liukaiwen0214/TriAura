package com.triauras.controller;

import com.triauras.entity.Users;
import com.triauras.vo.ResultVO;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * 测试控制器
 * 用于开发环境下的快速测试，提供模拟登录等功能
 */
@Slf4j
@Controller
@RequestMapping("/test")
public class TestController {

    /**
     * 测试首页
     */
    @GetMapping("")
    public String testIndex() {
        return "forward:/test-page.html";
    }

    /**
     * 模拟用户登录（用于测试）
     */
    @PostMapping("/mock-login")
    @ResponseBody
    public ResultVO<Map<String, Object>> mockLogin(HttpSession session) {
        Users user = new Users();
        // 更新用户头像URL
        user.setId(1L);
        user.setUsername("测试");
        user.setEmail("test@example.com");
        user.setPassword("123456");
        user.setAvatar_url("https://c-ssl.duitang.com/uploads/blog/202207/09/20220709150824_97667.jpg");
        user.setTimezone("Asia/Shanghai");
        user.setCurrency("CNY");
        user.setLast_login_at(java.sql.Timestamp.valueOf(java.time.LocalDateTime.now()));
        user.setIs_active(true);
        // 将用户信息存入会话
        session.setAttribute("user", user);
        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        result.put("sessionId", session.getId());
        log.info("用户登录成功 - 用户ID: {}, 用户名: {}", user.getId(), user.getUsername());
        return ResultVO.success(result);
    }

    /**
     * 检查登录状态
     */
    @GetMapping("/check-login")
    @ResponseBody
    public ResultVO<Users> checkLogin(HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        if (user == null) {
            return ResultVO.error("用户未登录");
        }
        return ResultVO.success(user);
    }

    /**
     * 模拟用户退出
     */
    @PostMapping("/mock-logout")
    @ResponseBody
    public ResultVO<Void> mockLogout(HttpSession session) {
        session.invalidate();
        log.info("模拟用户退出成功");
        return ResultVO.success();
    }
}