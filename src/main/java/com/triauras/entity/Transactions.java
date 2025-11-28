package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class Transactions extends BaseEntity {
    
    private Long user_id;
    
    private Long account_id;
    
    private String transaction_type;
    
    private BigDecimal amount;
    
    private LocalDate transaction_date;
    
    private String description;
    
    private String category;
    
    private String status;
    
    private Long bill_id;
}