package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class Habits extends BaseEntity {
    
    private Long user_id;
    
    private String habit_name;
    
    private String description;
    
    private String habit_type;
    
    private String target_frequency;
    
    private Integer target_count;
    
    private String reminder_time;
    
    private Boolean enable_reminder;
    
    private String color;
    
    private Boolean is_active;
}