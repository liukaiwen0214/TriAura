package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 学习资源实体类
 * 存储用户的学习资源
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class LearningResources extends BaseEntity {
    
    /**
     * 用户ID
     */
    private Long user_id;
    
    /**
     * 学习项目ID
     */
    private Long project_id;
    
    /**
     * 资源名称
     */
    private String resource_name;
    
    /**
     * 资源类型（书籍、视频、课程、文章等）
     */
    private String resource_type;
    
    /**
     * 资源链接或位置
     */
    private String resource_url;
    
    /**
     * 资源描述
     */
    private String description;
    
    /**
     * 资源状态（未开始、进行中、已完成）
     */
    private String status;
    
    /**
     * 优先级
     */
    private String priority;
    
    /**
     * 预计学习时长（小时）
     */
    private Integer estimated_hours;
    
    /**
     * 实际学习时长（小时）
     */
    private Integer actual_hours;
}