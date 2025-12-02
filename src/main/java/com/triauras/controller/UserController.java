package com.triauras.controller;

import com.triauras.entity.Users;
import com.triauras.exception.BusinessException;
import com.triauras.service.UsersService;
import com.triauras.utils.OSSUtils;
import com.triauras.vo.ResultCode;
import com.triauras.vo.ResultVO;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户控制器
 * 负责处理用户相关的HTTP请求，包括登录、注册、获取用户信息和退出登录等
 */
@Controller
@RequestMapping("/user")
@Slf4j
public class UserController {
    
    private final UsersService userService;

    /**
     * 构造函数，依赖注入用户服务
     *
     * @param userService 用户服务对象
     */
    public UserController(UsersService userService) {
        this.userService = userService;
    }

    /**
     * 用户登录接口
     *
     * @param users   用户登录信息
     * @param session HTTP会话对象
     * @return 登录结果响应
     */
    @PostMapping("/login")
    @ResponseBody
    public ResultVO<Map<String, Object>> login(@Valid @RequestBody Users users, HttpSession session) {
        // 请求入口日志
        log.info("【请求开始】用户登录, 参数: {}", users.toString());
        long startTime = System.currentTimeMillis();
        try {
             log.info("用户登录请求 - 邮箱: {}", users.getEmail());
            // 调用用户服务进行登录验证
            Users loginUser = userService.loginByEmail(users.getEmail(), users.getPassword());
            if (loginUser == null) {
                 log.warn("用户登录失败 - 邮箱: {}", users.getEmail());
                throw new BusinessException(ResultCode.PASSWORD_ERROR.getCode(), "邮箱或密码错误");
            }
            OSSUtils ossUtils = new OSSUtils();
            // 更新用户头像URL
            loginUser.setAvatar_url(ossUtils.getObjectUrl("Avatar/" + loginUser.getAvatar_url()));
            // 将用户信息存入会话
            session.setAttribute("user", loginUser);
            Map<String, Object> result = new HashMap<>();
            result.put("user", loginUser);
            result.put("sessionId", session.getId());
            
             log.info("用户登录成功 - 用户ID: {}, 用户名: {}", loginUser.getId(), loginUser.getUsername());
             log.info("用户登录", loginUser.getUsername(), "登录成功");
            
            return ResultVO.success(result);
        } finally {
            // 记录方法执行时间
             log.info("UserController.login 执行时间: {} ms", System.currentTimeMillis() - startTime);
        }
    }
    
    /**
     * 用户注册接口
     *
     * @param users 用户注册信息
     * @return 注册结果响应
     */
    @PostMapping("/register/adduser")
    @ResponseBody
    public ResultVO<Map<String, Object>> adduser(@Valid @RequestBody Users users) {
        long startTime = System.currentTimeMillis();
        try {
             log.info("用户注册请求 - 用户名: {}, 邮箱: {}", users.getUsername(), users.getEmail());
            
            // 调用用户服务进行注册
            String result = userService.registerUser(users);
            
            if ("注册成功".equals(result)) {
                Map<String, Object> response = new HashMap<>();
                response.put("userId", users.getId());
                response.put("username", users.getUsername());
                response.put("email", users.getEmail());
                
                 log.info("用户注册成功 - 用户ID: {}, 用户名: {}", users.getId(), users.getUsername());
                 log.info("用户注册", users.getUsername(), "注册成功");
                
                return ResultVO.success(response);
            } else {
                Map<String, Object> errors = new HashMap<>();
                // 根据不同的错误类型抛出相应的业务异常
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
            // 记录方法执行时间
            // LogUtil.logExecutionTime("UserController.adduser", startTime);
        }
    }

    /**
     * 获取当前登录用户信息
     *
     * @param session HTTP会话对象
     * @return 用户信息响应
     */
    @GetMapping("/info")
    @ResponseBody
    public ResultVO<Users> getUserInfo(HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        if (user == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "用户未登录");
        }
        return ResultVO.success(user);
    }

    /**
     * 用户退出登录
     *
     * @param session HTTP会话对象
     * @return 退出结果响应
     */
    @PostMapping("/logout")
    @ResponseBody
    public ResultVO<Void> logout(HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        if (user != null) {
            // LogUtil.logBusinessOperation("用户退出", user.getUsername(), "退出登录");
            // 使会话失效
            session.invalidate();
            // log.info("用户退出成功 - 用户名: {}", user.getUsername());
        }
        return ResultVO.success();
    }

    /**
     * 健康检查接口
     *
     * @return 服务状态响应
     */
    @GetMapping("/health")
    @ResponseBody
    public ResultVO<String> health() {
        return ResultVO.success("服务运行正常");
    }
    
    /**
     * 跳转到主页面
     *
     * @return 主页面视图名称
     */
    @GetMapping("/tiraura")
    public String toTriAura() {
        return "tiraura";
    }
    
    /**
     * 跳转到注册页面
     *
     * @return 注册页面视图名称
     */
    @GetMapping("/register")
    public String register() {
        return "register";
    }
    
    /**
     * 跳转到错误页面
     *
     * @return 错误页面视图名称
     */
    @GetMapping("/error")
    public String errorPage() {
        return "error";
    }
    
    /**
     * 跳转到成功页面
     *
     * @return 成功页面视图名称
     */
    @GetMapping("/success")
    public String successPage() {
        return "success";
    }
    
    /**
     * 跳转到用户个人资料页面
     *
     * @return 用户个人资料页面视图名称
     */
    @GetMapping("/profile")
    public String userProfile() {
        return "user/user-profile";
    }
}