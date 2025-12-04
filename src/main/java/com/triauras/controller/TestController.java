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
    @PostMapping("/mock-logins")
    @ResponseBody
    public ResultVO<Users> mockLogin(HttpSession session) {
        // 创建模拟用户
        Users mockUser = new Users();
        mockUser.setId(1L);
        mockUser.setUsername("testuser");
        mockUser.setEmail("test@example.com");
        mockUser.setAvatar_url("default_avatar.png");
        mockUser.setCreated_at(java.time.LocalDateTime.now());
        mockUser.setUpdated_at(java.time.LocalDateTime.now());
        mockUser.setIs_active(true);

        // 将模拟用户存入会话
        session.setAttribute("user", mockUser);
        System.out.println("模拟用户登录成功 - 用户名: " + mockUser.getUsername());
        log.info("模拟用户登录成功 - 用户名: {}", mockUser.getUsername());

        return ResultVO.success(mockUser);
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