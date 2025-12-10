package com.triauras.service.impl;

import com.triauras.entity.Tasks;
import com.triauras.mapper.TasksMapper;
import com.triauras.service.TasksService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class TasksServiceImpl implements TasksService {
    private final TasksMapper tasksMapper;

    /**
     * 构造函数，依赖注入待办映射器
     *
     * @param tasksMapper 待办数据访问对象
     */
    public TasksServiceImpl(TasksMapper tasksMapper) {
        this.tasksMapper = tasksMapper;
    }

    /**
     * 获取所有待办列表（包含已删除项）,需要根据user_id进行筛选
     *
     * @param userId 用户ID
     * @return 待办列表
     */
    @Override
    public List<Tasks> getToDoList(Integer userId) {
        log.info("【业务处理】获取用户所有待办列表（不含已删除项）, userId: {}", userId);
        return tasksMapper.getToDoList(userId);
    }

    @Override
    public Map<String, Integer> getToDoListStatistics(Integer userId) {
        log.info("【业务处理, userId: {}】获取用户待办事项统计信息（不含已删除项）", userId);
        return tasksMapper.getToDoListStatistics(userId);
    }
}
