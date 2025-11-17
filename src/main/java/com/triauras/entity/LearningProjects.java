package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

/**
 * 学习项目实体类
 * 存储用户的学习项目
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class LearningProjects extends BaseEntity {
    
    /**
     * 用户ID
     */
    private Long user_id;
    
    /**
     * 学习目标ID
     */
    private Long goal_id;
    
    /**
     * 项目名称
     */
    private String project_name;
    
    /**
     * 项目描述
     */
    private String description;
    
    /**
     * 项目类型（课程学习、实践项目、阅读等）
     */
    private String project_type;
    
    /**
     * 项目状态（进行中、已完成、暂停）
     */
    private String status;
    
    /**
     * 开始日期
     */
    private LocalDate start_date;
    
    /**
     * 预计完成日期
     */
    private LocalDate estimated_end_date;
    
    /**
     * 实际完成日期
     */
    private LocalDate completed_date;
    
    /**
     * 进度百分比
     */
    private Integer progress_percentage;
}