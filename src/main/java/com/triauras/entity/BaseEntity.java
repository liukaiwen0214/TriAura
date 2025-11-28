package com.triauras.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public abstract class BaseEntity {
    
    private Long id;
    
    private LocalDateTime created_at;
    
    private LocalDateTime updated_at;
    
    
    
    
    
    
}