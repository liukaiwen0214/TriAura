package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 式神实体类
 * 存储游戏中各种式神的信息
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Shikigami extends BaseEntity {

    /**
     * 式神ID
     */
    private Integer shikigami_id;
    
    /**
     * 式神名称
     */
    private String name;
    
    /**
     * 式神稀有度
     */
    private String rarity;
    
    /**
     * 式神声优
     */
    private String cv;
    
    /**
     * 式神发布日期
     */
    private LocalDate release_date;
    
    /**
     * 式神头像URL
     */
    private String head_image;
    
    /**
     * 记录创建时间
     */
    private LocalDateTime create_time;
    
    /**
     * 记录更新时间
     */
    private LocalDateTime update_time;
    /**
     * 式神是否可交互
     */
    private Integer interactive;
    /**
     * 式神素材类型
     */
    private Integer material_type;
}
