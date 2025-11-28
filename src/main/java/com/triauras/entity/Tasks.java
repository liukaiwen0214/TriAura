package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class Tasks extends BaseEntity {
    
    private Long user_id;
    
    private String title;
    
    private String description;
    
    private String status;
    
    private String priority;
    
    private LocalDate due_date;
    
    private LocalDate completed_date;
    
    private Integer estimated_hours;
    
    private Integer actual_hours;
    
    private String category;
    
    private Long project_id;
}