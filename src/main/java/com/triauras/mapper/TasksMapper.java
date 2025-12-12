package com.triauras.mapper;

import com.triauras.entity.Tasks;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface TasksMapper {
    /*
     * 获取所有待办列表（包含已删除项）,需要根据user_id进行筛选
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


    /**
     * 根据用户ID和状态列表查询任务
     *
     * @param userId     用户ID
     * @param statusList 状态列表
     * @param isDeleted  是否删除
     * @return 任务列表
     */
    List<Tasks> selectByUserIdAndStatusList(
            @Param("userId") Integer userId,
            @Param("statusList") List<Integer> statusList,
            @Param("isDeleted") Integer isDeleted
    );

    /**
     * 根据用户ID和自定义分组ID查询任务
     *
     * @param userId        用户ID
     * @param customGroupId 自定义分组ID
     * @param isDeleted     是否删除
     * @return 任务列表
     */
    List<Tasks> selectByUserIdAndCustomGroupId(
            @Param("userId") Integer userId,
            @Param("customGroupId") Integer customGroupId,
            @Param("isDeleted") Integer isDeleted
    );

    /**
     * 统计自定义分组下的任务数量
     *
     * @param customGroupId 自定义分组ID
     * @param isDeleted     是否删除
     * @return 任务数量
     */
    Integer countByCustomGroupId(
            @Param("customGroupId") Integer customGroupId,
            @Param("isDeleted") Integer isDeleted
    );
}
