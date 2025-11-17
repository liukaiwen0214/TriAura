package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

/**
 * 财务账户实体类
 * 存储用户的财务账户信息
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class FinanceAccounts extends BaseEntity {
    
    /**
     * 用户ID
     */
    private Long user_id;
    
    /**
     * 账户名称
     */
    private String account_name;
    
    /**
     * 账户类型（储蓄账户、信用卡、投资账户等）
     */
    private String account_type;
    
    /**
     * 账户余额
     */
    private BigDecimal balance;
    
    /**
     * 货币类型
     */
    private String currency;
    
    /**
     * 账户描述
     */
    private String description;
    
    /**
     * 是否活跃
     */
    private Boolean is_active;
}