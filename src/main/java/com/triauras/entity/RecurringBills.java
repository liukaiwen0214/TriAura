package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 定期账单实体类
 * 存储用户的定期账单信息
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class RecurringBills extends BaseEntity {
    
    /**
     * 用户ID
     */
    private Long user_id;
    
    /**
     * 账单名称
     */
    private String bill_name;
    
    /**
     * 账单金额
     */
    private BigDecimal amount;
    
    /**
     * 账单周期（每月、每季度、每年）
     */
    private String recurrence;
    
    /**
     * 下次付款日期
     */
    private LocalDate next_due_date;
    
    /**
     * 账单描述
     */
    private String description;
    
    /**
     * 是否自动支付
     */
    private Boolean auto_pay;
    
    /**
     * 是否活跃
     */
    private Boolean is_active;
}