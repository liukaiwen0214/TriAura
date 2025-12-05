package com.triauras.mapper;

import com.triauras.entity.ShikigamiActivity;

import java.util.List;

public interface ShikigamiActivityMapper {
    /**
     * 获取所有式神活动
     *
     * @return 式神活动列表
     */
    List<ShikigamiActivity> getShikigamiActivities();
}

