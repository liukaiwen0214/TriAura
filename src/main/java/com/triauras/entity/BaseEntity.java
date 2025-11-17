package com.triauras.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 基础实体类 - 包含所有实体共有的字段
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
    
    // 移除以下字段，因为数据库表中不存在
    // private String createdBy;
    // private String updatedBy;
    // private Integer deleted;
    // private Integer version;
}