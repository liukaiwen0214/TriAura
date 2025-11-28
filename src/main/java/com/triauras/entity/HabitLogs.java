package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class HabitLogs extends BaseEntity {
    
    private Long user_id;
    
    private Long habit_id;
    
    private LocalDate log_date;
    
    private String completion_status;
    
    private Integer completed_count;
    
    private String notes;
    
    private Integer quality_rating;
    
    private Integer duration_minutes;
}