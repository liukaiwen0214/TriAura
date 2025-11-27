package com.triauras.controller;


import com.aliyun.oss.ClientException;
import com.triauras.utils.OSSImageUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;


@Controller
@RequestMapping("/util")
public class UtilController {
    private static final Logger logger = LogManager.getLogger(UtilController.class);
    /**
     * 图片代理方法，用于隐藏OSS访问凭证
     */
    @RequestMapping("/image/{rarity}/{fileName}")
    public void proxyImage(@PathVariable String rarity, @PathVariable String fileName, HttpServletResponse response) {
        // 添加输出语句，记录访问的链接信息
        System.out.println("访问的图片路径: rarity=" + rarity + ", fileName=" + fileName);
        System.out.println("构建的OSS对象路径: Shikigami/HeadImg/" + rarity + "/" + fileName);

        try {
            // 创建OSSImageUtil实例
            OSSImageUtil ossImageUtil = new OSSImageUtil(
                    "oss-cn-beijing.aliyuncs.com",
                    "cn-beijing", "triaura",
                    "Shikigami/HeadImg/" + rarity + "/" + fileName
            );

            System.out.println("OSSImageUtil实例创建成功");

            // 使用新方法获取图片输入流
            try (InputStream in = ossImageUtil.getImageInputStream()) {
                System.out.println("成功获取图片输入流");

                // 设置响应内容类型
                String contentType = getContentType(fileName);
                response.setContentType(contentType);

                // 将输入流复制到响应输出流
                OutputStream out = response.getOutputStream();
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
                out.flush();
                System.out.println("图片数据传输完成");
            }
        } catch (ClientException e) {
            System.out.println("ClientException: " + e.getMessage());
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (IOException | com.aliyuncs.exceptions.ClientException e) {
            System.out.println("IOException或ClientException: " + e.getMessage());
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }


    /**
     * 根据文件名获取内容类型
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
