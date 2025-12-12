package com.triauras.service;

import com.triauras.entity.tools.DataVO;

public interface GeneralService {
    /**
     * 根据用户ID获取任务数据（包含默认分组和自定义分组）
     *
     * @param userId 用户ID
     * @return 任务数据载体
     */
    DataVO getTaskData(Integer userId);
}
