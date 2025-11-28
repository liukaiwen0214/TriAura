package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class Diaries extends BaseEntity {
    
    private Long user_id;
    
    private String title;
    
    private String content;
    
    private LocalDate diary_date;
    
    private String mood;
    
    private String weather;
    
    private String location;
    
    private String tags;
    
    private Boolean is_public;
}