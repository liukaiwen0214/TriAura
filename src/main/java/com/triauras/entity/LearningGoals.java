package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

/**
 * 学习目标实体类
 * 存储用户的学习目标
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class LearningGoals extends BaseEntity {
    
    /**
     * 用户ID
     */
    private Long user_id;
    
    /**
     * 目标名称
     */
    private String goal_name;
    
    /**
     * 目标描述
     */
    private String description;
    
    /**
     * 目标类型（技能学习、证书获取、知识掌握等）
     */
    private String goal_type;
    
    /**
     * 目标状态（进行中、已完成、已放弃）
     */
    private String status;
    
    /**
     * 优先级（高、中、低）
     */
    private String priority;
    
    /**
     * 开始日期
     */
    private LocalDate start_date;
    
    /**
     * 目标完成日期
     */
    private LocalDate target_date;
    
    /**
     * 实际完成日期
     */
    private LocalDate completed_date;
    
    /**
     * 进度百分比
     */
    private Integer progress_percentage;
}