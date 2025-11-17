package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

/**
 * 任务实体类
 * 存储用户的任务信息
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Tasks extends BaseEntity {
    
    /**
     * 用户ID
     */
    private Long user_id;
    
    /**
     * 任务标题
     */
    private String title;
    
    /**
     * 任务描述
     */
    private String description;
    
    /**
     * 任务状态（待办、进行中、已完成、已取消）
     */
    private String status;
    
    /**
     * 优先级（高、中、低）
     */
    private String priority;
    
    /**
     * 截止日期
     */
    private LocalDate due_date;
    
    /**
     * 实际完成日期
     */
    private LocalDate completed_date;
    
    /**
     * 预计耗时（小时）
     */
    private Integer estimated_hours;
    
    /**
     * 实际耗时（小时）
     */
    private Integer actual_hours;
    
    /**
     * 任务分类
     */
    private String category;
    
    /**
     * 关联的项目ID
     */
    private Long project_id;
}