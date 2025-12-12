package com.triauras.service.impl;

import com.triauras.entity.Tasks;
import com.triauras.entity.UserCustomGroup;
import com.triauras.entity.tools.CustomGroupVO;
import com.triauras.entity.tools.DataVO;
import com.triauras.entity.tools.DefaultGroupVO;
import com.triauras.mapper.TasksMapper;
import com.triauras.mapper.UserCustomGroupMapper;
import com.triauras.service.GeneralService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class GeneralServiceImpl implements GeneralService {


    // 未删除标识
    private static final Integer IS_DELETED_NO = 0;
    private final TasksMapper taskMapper;
    private final UserCustomGroupMapper userCustomGroupMapper;


    @Autowired
    public GeneralServiceImpl(TasksMapper taskMapper, UserCustomGroupMapper userCustomGroupMapper) {
        this.taskMapper = taskMapper;
        this.userCustomGroupMapper = userCustomGroupMapper;
    }

    @Override
    public DataVO getTaskData(Integer userId) {
        log.info("开始获取用户{}的任务数据", userId);
        DataVO dataVO = new DataVO();

        // 1. 处理默认分组（待处理、已完成、已取消）
        List<DefaultGroupVO> defaultGroupVOList = this.buildDefaultGroups(userId);
        dataVO.setDefaultGroups(defaultGroupVOList);

        // 2. 处理自定义分组
        List<CustomGroupVO> customGroupVOList = this.buildCustomGroups(userId);
        dataVO.setCustomGroups(customGroupVOList);

        log.info("获取用户{}的任务数据完成，默认分组数量：{}，自定义分组数量：{}",
                userId, defaultGroupVOList.size(), customGroupVOList.size());
        return dataVO;
    }

    /**
     * 构建默认分组数据
     *
     * @param userId 用户ID
     * @return 默认分组列表
     */
    private List<DefaultGroupVO> buildDefaultGroups(Integer userId) {
        List<DefaultGroupVO> defaultGroupVOList = new ArrayList<>();

        // 1. 待处理分组（状态：0-未开始，1-进行中）
        DefaultGroupVO pendingGroup = new DefaultGroupVO();
        pendingGroup.setGroupName("待处理");
        List<Integer> pendingStatus = Arrays.asList(0, 1);
        pendingGroup.setStatusList(pendingStatus);
        List<Tasks> pendingTasks = taskMapper.selectByUserIdAndStatusList(userId, pendingStatus, IS_DELETED_NO);
        pendingGroup.setTaskCount(pendingTasks.size());
        pendingGroup.setTasks(pendingTasks);
        defaultGroupVOList.add(pendingGroup);

        // 2. 已完成分组（状态：2-已完成）
        DefaultGroupVO completedGroup = new DefaultGroupVO();
        completedGroup.setGroupName("已完成");
        List<Integer> completedStatus = List.of(2);
        completedGroup.setStatusList(completedStatus);
        List<Tasks> completedTasks = taskMapper.selectByUserIdAndStatusList(userId, completedStatus, IS_DELETED_NO);
        completedGroup.setTaskCount(completedTasks.size());
        completedGroup.setTasks(completedTasks);
        defaultGroupVOList.add(completedGroup);

        // 3. 已取消分组（状态：3-已取消）
        DefaultGroupVO cancelledGroup = new DefaultGroupVO();
        cancelledGroup.setGroupName("已取消");
        List<Integer> cancelledStatus = List.of(3);
        cancelledGroup.setStatusList(cancelledStatus);
        List<Tasks> cancelledTasks = taskMapper.selectByUserIdAndStatusList(userId, cancelledStatus, IS_DELETED_NO);
        cancelledGroup.setTaskCount(cancelledTasks.size());
        cancelledGroup.setTasks(cancelledTasks);
        defaultGroupVOList.add(cancelledGroup);

        return defaultGroupVOList;
    }

    /**
     * 构建自定义分组数据
     *
     * @param userId 用户ID
     * @return 自定义分组列表
     */
    private List<CustomGroupVO> buildCustomGroups(Integer userId) {
        List<CustomGroupVO> customGroupVOList = new ArrayList<>();

        // 1. 查询用户的自定义分组（未删除）
        List<UserCustomGroup> customGroupList = userCustomGroupMapper.selectByUserId(userId, IS_DELETED_NO);
        if (CollectionUtils.isEmpty(customGroupList)) {
            log.warn("用户{}暂无自定义分组", userId);
            return customGroupVOList;
        }

        // 2. 按sort升序排序（保证分组顺序正确）
        customGroupList = customGroupList.stream()
                .sorted(Comparator.comparingInt(UserCustomGroup::getSort))
                .collect(Collectors.toList());

        // 3. 组装每个自定义分组的任务数据
        for (UserCustomGroup group : customGroupList) {
            CustomGroupVO customGroupVO = new CustomGroupVO();
            customGroupVO.setGroupId(group.getGroup_id());
            customGroupVO.setGroupName(group.getGroup_name());
            customGroupVO.setSort(group.getSort());

            // 查询该分组下的任务
            List<Tasks> groupTasks = taskMapper.selectByUserIdAndCustomGroupId(userId, group.getGroup_id(), IS_DELETED_NO);
            customGroupVO.setTaskCount(groupTasks.size());
            customGroupVO.setTasks(groupTasks);

            customGroupVOList.add(customGroupVO);
        }

        return customGroupVOList;
    }
}