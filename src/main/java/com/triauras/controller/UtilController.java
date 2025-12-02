package com.triauras.controller;

import com.aliyun.oss.ClientException;
import com.triauras.utils.OSSUtils;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * 工具控制器
 * 负责处理通用工具相关的HTTP请求，如图片代理服务
 */
@Slf4j
@Controller
@RequestMapping("/util")
public class UtilController {
    /**
     * 图片代理接口，用于从OSS获取图片并返回给客户端
     *
     * @param rarity   式神稀有度
     * @param fileName 图片文件名
     * @param response HTTP响应对象
     */
    @RequestMapping("/image/{rarity}/{fileName}")
    public void proxyImage(@PathVariable String rarity, @PathVariable String fileName, HttpServletResponse response) {
        try {
            // 初始化OSS图片工具
            OSSUtils ossUtil = new OSSUtils();
            // 获取图片输入流并写入响应
            try (InputStream in = ossUtil.getImageInputStream("Shikigami/HeadImg/"+rarity + "/" + fileName)) {
                // 设置响应内容类型
                String contentType = getContentType(fileName);
                response.setContentType(contentType);

                // 将图片数据写入响应输出流
                OutputStream out = response.getOutputStream();
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
                out.flush();
            }
        } catch (ClientException e) {
            // 处理OSS客户端异常
            log.error("从OSS获取图片时出错: {}", fileName, e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (IOException | com.aliyuncs.exceptions.ClientException e) {
            // 处理IO异常或阿里云客户端异常
            log.error("IOException或ClientException: {}", fileName, e);
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }


    /**
     * 根据文件名获取对应的Content-Type
     *
     * @param fileName 文件名
     * @return Content-Type字符串
     */
    private String getContentType(String fileName) {
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (fileName.endsWith(".png")) {
            return "image/png";
        } else if (fileName.endsWith(".gif")) {
            return "image/gif";
        } else {
            return "application/octet-stream";
        }
    }
}