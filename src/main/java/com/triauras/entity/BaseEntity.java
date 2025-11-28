package com.triauras.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 基础实体类
 * 所有业务实体类的父类，包含通用的字段和属性
 */
@Data
public abstract class BaseEntity {
    
    /**
     * 主键ID
     */
    private Long id;
    
    /**
     * 创建时间
     */
    private LocalDateTime created_at;
    
    /**
     * 更新时间
     */
    private LocalDateTime updated_at;
}