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
    @RequestMapping("/image/{rarity}/{fileName}")
    public void proxyImage(@PathVariable String rarity, @PathVariable String fileName, HttpServletResponse response) {
        try {
            
            OSSImageUtil ossImageUtil = new OSSImageUtil(
                    "oss-cn-beijing.aliyuncs.com",
                    "cn-beijing", "triaura",
                    "Shikigami/HeadImg/" + rarity + "/" + fileName
            );
            
            try (InputStream in = ossImageUtil.getImageInputStream()) {
                
                String contentType = getContentType(fileName);
                response.setContentType(contentType);
                
                OutputStream out = response.getOutputStream();
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
                out.flush();
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
