package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class LearningProjects extends BaseEntity {
    
    private Long user_id;
    
    private Long goal_id;
    
    private String project_name;
    
    private String description;
    
    private String project_type;
    
    private String status;
    
    private LocalDate start_date;
    
    private LocalDate estimated_end_date;
    
    private LocalDate completed_date;
    
    private Integer progress_percentage;
}