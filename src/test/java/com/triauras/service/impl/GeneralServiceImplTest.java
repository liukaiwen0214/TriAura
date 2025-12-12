package com.triauras.service.impl;

import com.triauras.entity.tools.DataVO;
import com.triauras.service.GeneralService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@Slf4j
@ExtendWith(SpringExtension.class)
@ContextConfiguration(locations = {"classpath:/config/applicationContext.xml", "classpath:/config/springmvc-servlet.xml"})
class GeneralServiceImplTest {
    @Autowired
    private GeneralService generalService;

    @Test
    void getGeneralTools() {
        DataVO dataVO = generalService.getTaskData(1);
        log.info("generalTools: {}", dataVO);
    }
}