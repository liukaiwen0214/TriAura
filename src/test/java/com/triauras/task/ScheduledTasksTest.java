package com.triauras.task;


import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.stereotype.Component;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;



/**
 * 定时任务测试类
 */
@Component
@Slf4j
@ExtendWith(SpringExtension.class)
@ContextConfiguration(locations = {"classpath:/config/applicationContext.xml", "classpath:/config/springmvc-servlet.xml"})
class ScheduledTasksTest {
//    private final Logger logger = LoggerFactory.getLogger(ScheduledTasksTest.class.getName());
//    // 注入你的定时任务 Bean
//    @Autowired
//    private ScheduledTasks shikigamiScheduledTask;
//
//    @Test
//    public void testRunScheduledTask() {
//        logger.info("Running test");
//        // 立即执行定时任务
//        shikigamiScheduledTask.ScheduledTaskForShikigami();
//    }
}