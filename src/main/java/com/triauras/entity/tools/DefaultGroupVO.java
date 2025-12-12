package com.triauras.entity.tools;

import com.triauras.entity.Tasks;
import lombok.Data;

import java.util.List;

@Data
public class DefaultGroupVO {
    private String groupName; // 分组名称
    private List<Integer> statusList; // 状态列表
    private Integer taskCount; // 任务数量
    private List<Tasks> tasks; // 任务列表（数组）
}
