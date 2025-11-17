package com.triauras.controller;
import com.triauras.entity.UsersEntity;
import com.triauras.service.UsersService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

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
    public String login(@RequestParam("username") String username, @RequestParam("password_hash") String password_hash, HttpSession session) {
        UsersEntity user = userService.getUserByUsername(username, password_hash);
        if (user == null) {
            return "error";
        }
        session.setAttribute("user", user);
        return "success";
    }
}
