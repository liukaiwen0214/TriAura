package com.triauras.service.impl;

import com.triauras.service.ShikigamiService;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.ContextConfiguration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;




@ExtendWith(SpringExtension.class)
@ContextConfiguration(locations = {"classpath:/config/applicationContext.xml", "classpath:/config/springmvc-servlet.xml"})
class ShikigamiServiceImplTest {
    private final Logger logger = LoggerFactory.getLogger(ShikigamiServiceImplTest.class.getName());
    @Autowired
    private ShikigamiService shikigamiService;
     /**
      * 测试获取所有式神信息
      */
    @Test
    void fetchAndSaveShikigamiList() {
        // 执行测试
        int count = shikigamiService.fetchAndSaveShikigamiList();
        logger.info("获取到的式神数量: {}", count);
    }
}