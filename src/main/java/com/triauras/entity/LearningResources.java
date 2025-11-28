package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class LearningResources extends BaseEntity {
    
    private Long user_id;
    
    private Long project_id;
    
    private String resource_name;
    
    private String resource_type;
    
    private String resource_url;
    
    private String description;
    
    private String status;
    
    private String priority;
    
    private Integer estimated_hours;
    
    private Integer actual_hours;
}