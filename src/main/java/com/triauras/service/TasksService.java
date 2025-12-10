package com.triauras.service;

import com.triauras.entity.Tasks;

import java.util.List;
import java.util.Map;

public interface TasksService {
    /**
     * 获取所有待办列表（包含已删除项）,需要根据user_id进行筛选
     *
     * @param userId 用户ID
     * @return 待办列表
     */
    List<Tasks> getToDoList(Integer userId);

    /**
     * 获取用户待办事项统计信息（包含已删除项）
     *
     * @param userId 用户ID
     * @return 待办事项统计信息（Map格式）
     */
    Map<String, Integer> getToDoListStatistics(Integer userId);
}
