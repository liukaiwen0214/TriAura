package com.triauras.controller;

import com.triauras.entity.Users;
import com.triauras.service.UsersService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@Controller
@RequestMapping("/user")
public class UserController {
    private final UsersService userService;

    public UserController(UsersService userService) {
        this.userService = userService;
    }

    private final Logger logger = Logger.getLogger(UserController.class.getName());

    /**
     * 登录
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String login(@RequestBody Users users, HttpSession session) {
        Users users2 = userService.loginByEmail(users.getEmail(), users.getPassword());
        if (users2 == null) {
            logger.warning("User not found");
            return "error";
        }
        session.setAttribute("user", users2);
        return "success";
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public String register() {
        return "register";
    }

    /**
     * 注册
     */
    @RequestMapping(value = "/register/adduser", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> adduser(@RequestBody Users users) {
        Map<String, Object> response = new HashMap<>();

        String result = userService.registerUser(users);

        if ("注册成功".equals(result)) {
            logger.info("注册成功");
            response.put("success", true);
            response.put("message", "注册成功");
            return ResponseEntity.ok(response);
        } else {
            logger.warning(result);
            response.put("success", false);
            response.put("message", result);

            // 添加具体的错误字段信息
            Map<String, String> errors = new HashMap<>();
            if ("邮箱已存在".equals(result)) {
                errors.put("email", "该邮箱已被注册");
            } else if ("用户名已存在".equals(result)) {
                errors.put("username", "该用户名已被使用");
            } else {
                errors.put("general", result);
            }
            response.put("errors", errors);

            return ResponseEntity.badRequest().body(response);
        }
    }
}
