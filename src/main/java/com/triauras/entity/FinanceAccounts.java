package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class FinanceAccounts extends BaseEntity {
    
    private Long user_id;
    
    private String account_name;
    
    private String account_type;
    
    private BigDecimal balance;
    
    private String currency;
    
    private String description;
    
    private Boolean is_active;
}