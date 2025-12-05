package com.triauras.service.impl;

import com.triauras.entity.ShikigamiActivity;
import com.triauras.mapper.ShikigamiActivityMapper;
import com.triauras.service.ShikigamiActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ShikigamiActivityServiceImpl implements ShikigamiActivityService {
    private final ShikigamiActivityMapper sam;

    @Autowired
    public ShikigamiActivityServiceImpl(ShikigamiActivityMapper shikigamiActivityMapper) {
        this.sam = shikigamiActivityMapper;
    }


    @Override
    public List<ShikigamiActivity> getShikigamiActivities() {
        log.info("获取所有式神活动");
        return sam.getShikigamiActivities();
    }
}
