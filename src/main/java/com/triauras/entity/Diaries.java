package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

/**
 * 日记实体类
 * 存储用户的日记记录
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Diaries extends BaseEntity {
    
    /**
     * 用户ID
     */
    private Long user_id;
    
    /**
     * 日记标题
     */
    private String title;
    
    /**
     * 日记内容
     */
    private String content;
    
    /**
     * 日记日期
     */
    private LocalDate diary_date;
    
    /**
     * 心情状态
     */
    private String mood;
    
    /**
     * 天气
     */
    private String weather;
    
    /**
     * 位置
     */
    private String location;
    
    /**
     * 标签（多个标签用逗号分隔）
     */
    private String tags;
    
    /**
     * 是否公开
     */
    private Boolean is_public;
}