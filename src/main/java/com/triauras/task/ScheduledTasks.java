package com.triauras.task;

import com.triauras.service.ShikigamiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 定时任务类
 * 用于执行项目中的定时操作
 */
@Component
@Slf4j
public class ScheduledTasks {
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private final ShikigamiService shikigamiService;

    /**
     * 构造函数，用于依赖注入
     *
     * @param shikigamiService 式神服务
     */
    public ScheduledTasks(ShikigamiService shikigamiService) {
        this.shikigamiService = shikigamiService;
    }

    /**
     * 每5秒执行一次的测试任务
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void testTask() {
        String currentTime = LocalDateTime.now().format(DATE_TIME_FORMATTER);
        log.info("开始执行获取式神数据的定时任务，当前时间: {}", currentTime);

        try {
            // 清空现有数据

            // 获取并保存新数据
            int count = shikigamiService.fetchAndSaveShikigamiList();
            log.info("获取并保存式神数据完成，保存数量: {}", count);
        } catch (Exception e) {
            log.error("获取并保存式神数据失败: {}", e.getMessage(), e);
        }

    }
}