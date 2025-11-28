package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class RecurringBills extends BaseEntity {
    
    private Long user_id;
    
    private String bill_name;
    
    private BigDecimal amount;
    
    private String recurrence;
    
    private LocalDate next_due_date;
    
    private String description;
    
    private Boolean auto_pay;
    
    private Boolean is_active;
}