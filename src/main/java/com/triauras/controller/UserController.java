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

/**
 * 用户控制器 - 处理用户相关的HTTP请求
 * 包括用户登录、注册、信息获取、退出登录等功能
 * 
 * @author TriAuras Team
 * @version 1.0
 * @since 2024
 */
@Slf4j
@Controller
@RequestMapping("/user")
public class UserController {
    
    /**
     * 用户服务层接口，用于处理业务逻辑
     */
    private final UsersService userService;

    /**
     * 构造函数 - 通过Spring依赖注入UsersService
     * 
     * @param userService 用户服务实例
     */
    public UserController(UsersService userService) {
        this.userService = userService;
    }

    /**
     * 用户登录接口
     * POST请求：/user/login
     * 
     * @param users 用户登录信息（包含邮箱和密码）
     * @param session HTTP会话对象，用于存储用户登录状态
     * @return 包含用户信息和会话ID的响应结果
     * @throws BusinessException 当邮箱或密码错误时抛出业务异常
     * 
     * 处理流程：
     * 1. 验证用户输入参数
     * 2. 调用服务层进行登录验证
     * 3. 登录成功后将用户信息存入session
     * 4. 返回包含用户信息和会话ID的响应
     */
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
            
            // 将用户信息存入session，用于后续请求的身份验证
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
    /**
     * 用户注册接口
     * POST请求：/user/register/adduser
     * 
     * @param users 用户注册信息（包含用户名、邮箱、密码等）
     * @return 包含新用户基本信息的响应结果
     * @throws BusinessException 当用户名或邮箱已存在时抛出业务异常
     * 
     * 处理流程：
     * 1. 验证用户输入参数
     * 2. 调用服务层进行用户注册
     * 3. 根据注册结果返回相应的响应
     * 4. 记录业务操作日志
     */
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

    /**
     * 获取当前登录用户信息
     * GET请求：/user/info
     * 
     * @param session HTTP会话对象，用于获取当前登录用户信息
     * @return 包含当前用户信息的响应结果
     * @throws BusinessException 当用户未登录时抛出未授权异常
     * 
     * 使用场景：
     * - 前端页面需要显示当前用户信息时调用
     * - 用户登录后验证会话状态
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
     * 用户退出登录接口
     * POST请求：/user/logout
     * 
     * @param session HTTP会话对象，用于清除用户登录状态
     * @return 退出成功的响应结果
     * 
     * 处理流程：
     * 1. 从session中获取当前用户信息
     * 2. 记录退出登录的业务日志
     * 3. 使当前session失效，清除所有session数据
     * 4. 返回退出成功的响应
     */
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

    /**
     * 健康检查接口
     * GET请求：/user/health
     * 
     * @return 服务健康状态响应
     * 
     * 使用场景：
     * - 监控系统检查服务是否正常运行
     * - 负载均衡器健康检查
     * - 部署验证
     */
    @GetMapping("/health")
    @ResponseBody
    public ResultVO<String> health() {
        return ResultVO.success("服务运行正常");
    }
     /**
     * 跳转到TriAura主页
     * GET请求：/user/triAura
     *
     * @return TriAura主页视图名称
     *
     * 使用场景：
     * - 用户登录后，点击“进入TriAura”按钮跳转至TriAura主页
     */
    @GetMapping("/tiraura")
    public String toTriAura() {
        return "tiraura";
    }
    /**
     * 用户注册页面
     * GET请求：/user/register
     *
     * @return 注册页面的视图名称
     */
    @GetMapping("/register")
    public String register() {
        return "register";
    }
    /**
     * 错误处理页面
     * GET请求：/user/error
     *
     * @return 错误处理页面的视图名称
     */
    @GetMapping("/error")
    public String errorPage() {
        return "error";
    }
    /**
     * 成功处理页面
     * GET请求：/user/success
     *
     * @return 成功处理页面的视图名称
     */
    @GetMapping("/success")
    public String successPage() {
        return "success";
    }
     /**
     * 用户个人资料页面
     * GET请求：/user/profile
     *
     * @return 用户个人资料页面的视图名称
     */
    @GetMapping("/profile")
    public String userProfile() {
        return "user/user-profile";
    }
}