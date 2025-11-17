package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 预算实体类
 * 存储用户的预算设置
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Budgets extends BaseEntity {
    
    /**
     * 用户ID
     */
    private Long user_id;
    
    /**
     * 预算名称
     */
    private String budget_name;
    
    /**
     * 预算金额
     */
    private BigDecimal amount;
    
    /**
     * 预算周期（月度、季度、年度）
     */
    private String period;
    
    /**
     * 开始日期
     */
    private LocalDate start_date;
    
    /**
     * 结束日期
     */
    private LocalDate end_date;
    
    /**
     * 预算分类
     */
    private String category;
    
    /**
     * 当前支出金额
     */
    private BigDecimal current_spent;
    
    /**
     * 是否活跃
     */
    private Boolean is_active;
}