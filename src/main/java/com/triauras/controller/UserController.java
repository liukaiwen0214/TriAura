package com.triauras.controller;

import com.triauras.entity.Users;
import com.triauras.exception.BusinessException;
import com.triauras.service.UsersService;
import com.triauras.utils.LogUtil;
import com.triauras.vo.ResultCode;
import com.triauras.vo.ResultVO;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/user")
public class UserController {
    
    private final UsersService userService;

    public UserController(UsersService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    @ResponseBody
    public ResultVO<Map<String, Object>> login(@Valid @RequestBody Users users, HttpSession session) {
        long startTime = System.currentTimeMillis();
        try {
            log.info("用户登录请求 - 邮箱: {}", users.getEmail());
            Users loginUser = userService.loginByEmail(users.getEmail(), users.getPassword());
            if (loginUser == null) {
                log.warn("用户登录失败 - 邮箱: {}", users.getEmail());
                throw new BusinessException(ResultCode.PASSWORD_ERROR.getCode(), "邮箱或密码错误");
            }
            
            
            session.setAttribute("user", loginUser);
            Map<String, Object> result = new HashMap<>();
            result.put("user", loginUser);
            result.put("sessionId", session.getId());
            
            log.info("用户登录成功 - 用户ID: {}, 用户名: {}", loginUser.getId(), loginUser.getUsername());
            LogUtil.logBusinessOperation("用户登录", loginUser.getUsername(), "登录成功");
            
            return ResultVO.success(result);
        } finally {
            LogUtil.logExecutionTime("UserController.login", startTime);
        }
    }
    @PostMapping("/register/adduser")
    @ResponseBody
    public ResultVO<Map<String, Object>> adduser(@Valid @RequestBody Users users) {
        long startTime = System.currentTimeMillis();
        try {
            log.info("用户注册请求 - 用户名: {}, 邮箱: {}", users.getUsername(), users.getEmail());
            
            String result = userService.registerUser(users);
            
            if ("注册成功".equals(result)) {
                Map<String, Object> response = new HashMap<>();
                response.put("userId", users.getId());
                response.put("username", users.getUsername());
                response.put("email", users.getEmail());
                
                log.info("用户注册成功 - 用户ID: {}, 用户名: {}", users.getId(), users.getUsername());
                LogUtil.logBusinessOperation("用户注册", users.getUsername(), "注册成功");
                
                return ResultVO.success(response);
            } else {
                Map<String, Object> errors = new HashMap<>();
                if ("邮箱已存在".equals(result)) {
                    errors.put("email", "该邮箱已被注册");
                    throw new BusinessException(ResultCode.USER_EXISTS.getCode(), "邮箱已存在");
                } else if ("用户名已存在".equals(result)) {
                    errors.put("username", "该用户名已被使用");
                    throw new BusinessException(ResultCode.USER_EXISTS.getCode(), "用户名已存在");
                } else {
                    errors.put("general", result);
                    throw new BusinessException(ResultCode.ERROR.getCode(), result);
                }
            }
        } finally {
            LogUtil.logExecutionTime("UserController.adduser", startTime);
        }
    }

    @GetMapping("/info")
    @ResponseBody
    public ResultVO<Users> getUserInfo(HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        if (user == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "用户未登录");
        }
        return ResultVO.success(user);
    }

    @PostMapping("/logout")
    @ResponseBody
    public ResultVO<Void> logout(HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        if (user != null) {
            LogUtil.logBusinessOperation("用户退出", user.getUsername(), "退出登录");
            session.invalidate();
            log.info("用户退出成功 - 用户名: {}", user.getUsername());
        }
        return ResultVO.success();
    }

    @GetMapping("/health")
    @ResponseBody
    public ResultVO<String> health() {
        return ResultVO.success("服务运行正常");
    }
    @GetMapping("/tiraura")
    public String toTriAura() {
        return "tiraura";
    }
    @GetMapping("/register")
    public String register() {
        return "register";
    }
    @GetMapping("/error")
    public String errorPage() {
        return "error";
    }
    @GetMapping("/success")
    public String successPage() {
        return "success";
    }
    @GetMapping("/profile")
    public String userProfile() {
        return "user/user-profile";
    }
}