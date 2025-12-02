package com.triauras.service.impl;

import com.triauras.entity.Shikigami;
import com.triauras.service.ShikigamiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.ContextConfiguration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Slf4j
@ExtendWith(SpringExtension.class)
@ContextConfiguration(locations = {"classpath:/config/applicationContext.xml", "classpath:/config/springmvc-servlet.xml"})
class ShikigamiServiceImplTest {
    @Autowired
    private ShikigamiService shikigamiService;

    /**
     * 测试获取所有式神信息
     */
    @Test
    void fetchAndSaveShikigamiList() {
        // 执行测试
        int count = shikigamiService.fetchAndSaveShikigamiList();
        log.info("获取到的式神数量: {}", count);
    }

    /**
     * 测试根据式神ID下载网易图片并上传到OSS
     */
    @Test
    void downloadAndUploadImageById() {
        // 执行测试
        String imgUrl = "https://yys.res.netease.com/pc/zt/20161108171335/data/shishen/200.png";
        String head_name = "200.png";
        String bucketName = "triaura";
        String rarity = "SR";
        String ossPath = shikigamiService.downloadAndUploadImageById(imgUrl, head_name, bucketName, rarity);
        log.info("上传到OSS的路径: {}", ossPath);
    }

    @Test
    void updateShikigami() {
        // 执行测试
        Shikigami shikigami = shikigamiService.findShikigamiById(1);
        log.info("查询到的式神信息: {}", shikigami);
    }
}