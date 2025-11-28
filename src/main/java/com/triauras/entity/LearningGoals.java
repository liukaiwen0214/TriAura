package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class LearningGoals extends BaseEntity {
    
    private Long user_id;
    
    private String goal_name;
    
    private String description;
    
    private String goal_type;
    
    private String status;
    
    private String priority;
    
    private LocalDate start_date;
    
    private LocalDate target_date;
    
    private LocalDate completed_date;
    
    private Integer progress_percentage;
}