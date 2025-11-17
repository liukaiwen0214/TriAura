package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

/**
 * 习惯日志实体类
 * 存储用户的习惯执行记录
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class HabitLogs extends BaseEntity {
    
    /**
     * 用户ID
     */
    private Long user_id;
    
    /**
     * 习惯ID
     */
    private Long habit_id;
    
    /**
     * 记录日期
     */
    private LocalDate log_date;
    
    /**
     * 完成状态（已完成、跳过、部分完成）
     */
    private String completion_status;
    
    /**
     * 完成次数
     */
    private Integer completed_count;
    
    /**
     * 备注
     */
    private String notes;
    
    /**
     * 完成质量评分（1-5分）
     */
    private Integer quality_rating;
    
    /**
     * 完成时长（分钟）
     */
    private Integer duration_minutes;
}