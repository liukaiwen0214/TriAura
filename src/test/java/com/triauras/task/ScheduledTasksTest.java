package com.triauras.task;

import org.junit.jupiter.api.extension.ExtendWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;


/**
 * 定时任务测试类
 */
@Component
@Slf4j
@ExtendWith(SpringExtension.class)
@ContextConfiguration(locations = {"classpath:/config/applicationContext.xml", "classpath:/config/springmvc-servlet.xml"})
class ScheduledTasksTest {
//    private final Logger logger = LoggerFactory.getLogger(ScheduledTasksTest.class.getName());

//    @Scheduled(cron = "0/5 * * * * ?")
//    public void testTask() {
//        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
//        log.info("===== 测试定时任务执行，当前时间: {}", currentTime);
//        System.out.println("[控制台输出] 测试定时任务执行，当前时间: " + currentTime);
//    }
}