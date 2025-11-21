package com.triauras.controller;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;



@Controller
@RequestMapping("/record")
public class MessageController {
    private static final Logger logger = LogManager.getLogger(MessageController.class);
    // 接收 POST 请求，路径为 /log
    @PostMapping("/messageInfo")
    @ResponseBody
    public String handleLog(@RequestParam("info") String info) {
        // 在 Tomcat 控制台输出信息
        System.out.println("前端操作日志: " + info);
        logger.info("Log4j2直接API日志: {}", info);
        return "信息已输出到服务器控制台";
    }
}
