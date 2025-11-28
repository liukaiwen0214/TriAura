package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class Budgets extends BaseEntity {
    
    private Long user_id;
    
    private String budget_name;
    
    private BigDecimal amount;
    
    private String period;
    
    private LocalDate start_date;
    
    private LocalDate end_date;
    
    private String category;
    
    private BigDecimal current_spent;
    
    private Boolean is_active;
}