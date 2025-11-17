package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 交易记录实体类
 * 存储用户的财务交易记录
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Transactions extends BaseEntity {
    
    /**
     * 用户ID
     */
    private Long user_id;
    
    /**
     * 账户ID
     */
    private Long account_id;
    
    /**
     * 交易类型（收入、支出、转账等）
     */
    private String transaction_type;
    
    /**
     * 交易金额
     */
    private BigDecimal amount;
    
    /**
     * 交易日期
     */
    private LocalDate transaction_date;
    
    /**
     * 交易描述
     */
    private String description;
    
    /**
     * 分类（餐饮、交通、购物等）
     */
    private String category;
    
    /**
     * 交易状态（已完成、待处理、已取消）
     */
    private String status;
    
    /**
     * 关联的账单ID（如果是账单支付）
     */
    private Long bill_id;
}