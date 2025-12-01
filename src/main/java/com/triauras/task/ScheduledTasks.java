package com.triauras.task;

import com.triauras.service.ShikigamiService;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class ScheduledTasks {
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private final ShikigamiService shikigamiService;

    public ScheduledTasks(ShikigamiService shikigamiService) {
        this.shikigamiService = shikigamiService;
    }

    @Scheduled(cron = "0 0 1 * * ?")
    public void ScheduledTaskForShikigami() {
        String currentTime = LocalDateTime.now().format(DATE_TIME_FORMATTER);
        // log.info("开始执行获取式神数据的定时任务，当前时间: {}", currentTime);
        try {
            
            int count = shikigamiService.fetchAndSaveShikigamiList();
            String url = "https://yys.res.netease.com/pc/zt/20161108171335/data/shishen/";
            shikigamiService.findAllShikigami().forEach(shikigami -> shikigamiService.downloadAndUploadImageById(url+shikigami.getHead_image(), shikigami.getHead_image(), "triaura", shikigami.getRarity()));
            // log.info("获取并保存式神数据完成，保存数量: {}", count);
        } catch (Exception e) {
            // log.error("获取并保存式神数据失败: {}", e.getMessage(), e);
        }
    }
}