package com.triauras.service.impl;

import com.triauras.entity.ShikigamiActivity;
import com.triauras.service.ShikigamiActivityService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

@Slf4j
@ExtendWith(SpringExtension.class)
@ContextConfiguration(locations = {"classpath:/config/applicationContext.xml", "classpath:/config/springmvc-servlet.xml"})
class ShikigamiActivityServiceImplTest {
    @Autowired
    private ShikigamiActivityService shikigamiActivityService;


    @Test
    void getShikigamiActivities() {
        List<ShikigamiActivity> shikigamiActivities = shikigamiActivityService.getShikigamiActivities();
        for (ShikigamiActivity activity : shikigamiActivities) {
            log.info("获取到的活动：{}", activity);
        }
    }
}