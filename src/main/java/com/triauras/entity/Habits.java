package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 习惯实体类
 * 存储用户的习惯设置
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Habits extends BaseEntity {
    
    /**
     * 用户ID
     */
    private Long user_id;
    
    /**
     * 习惯名称
     */
    private String habit_name;
    
    /**
     * 习惯描述
     */
    private String description;
    
    /**
     * 习惯类型（健康、学习、工作、生活等）
     */
    private String habit_type;
    
    /**
     * 目标频率（每天、每周几次、每月几次）
     */
    private String target_frequency;
    
    /**
     * 目标次数
     */
    private Integer target_count;
    
    /**
     * 提醒时间
     */
    private String reminder_time;
    
    /**
     * 是否启用提醒
     */
    private Boolean enable_reminder;
    
    /**
     * 习惯颜色或图标
     */
    private String color;
    
    /**
     * 是否活跃
     */
    private Boolean is_active;
}