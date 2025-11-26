package com.triauras.entity;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 式神实体类
 * 存储项目中使用的式神信息
 */
@Data
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
     * 创建时间
     */
    private LocalDateTime create_time;
    /**
     * 更新时间
     */
    private LocalDateTime update_time;
}
