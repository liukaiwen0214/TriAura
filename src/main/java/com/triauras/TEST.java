package com.triauras;

import com.aliyuncs.exceptions.ClientException;
import com.triauras.utils.OSSImageUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Properties;


public class TEST {
    public static void main(String[] args) throws Throwable, ClientException {
        // 1. create log
        Logger log = LogManager.getLogger(TEST.class);
        
        // 3. start log
        log.debug("Here is some DEBUG");
        log.info("Here is some INFO");
        log.warn("Here is some WARN");
        log.error("Here is some ERROR");
        log.fatal("Here is some FATAL");
    }

    /**
     * 获取OSS上的头像URL
     * @throws ClientException
     */
    public static void getAvatarUrl() throws ClientException {
        OSSImageUtil ossImageUtil = new OSSImageUtil(
                "https://oss-cn-beijing.aliyuncs.com",
                "cn-beijing",
                "triaura",
                "Avatar/IMG_5423.jpeg"
        );
        String avatarUrl = ossImageUtil.getAvatarUrl();
        System.out.println(avatarUrl);
    }

}
