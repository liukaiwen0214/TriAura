package com.triauras.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ShikigamiActivity {
    /**
     * 活动ID
     */
    private Integer activity_id;
    /**
     * 活动名称
     */
    private String activity_name;
    /**
     * 活动类型
     */
    private String activity_type;
    /**
     * 活动描述
     */
    private String description;
    /**
     * 活动颜色
     */
    private String activity_color;
    /**
     * 活动开始时间
     */
    private LocalDateTime start_time;
    /**
     * 活动结束时间
     */
    private LocalDateTime end_time;
    /**
     * 活动状态（如：进行中、已结束、未开始等）
     */
    private String status;
    /**
     * 参与活动所需的最低等级要求
     */
    private Integer level_required;
    /**
     * 参与活动消耗的体力值
     */
    private Integer stamina_cost;
    /**
     * 活动封面图片URL
     */
    private String cover_image;
    /**
     * 活动详情图片URL
     */
    private String detail_image;
    /**
     * 活动规则说明文本
     */
    private String rule_text;
    /**
     * 活动奖励信息描述
     */
    private String reward_info;
    /**
     * 关联的副本ID
     */
    private Integer dungeon_id;
    /**
     * 活动是否可重复参与
     */
    private Boolean is_repeatable;
    /**
     * 最大参与次数限制
     */
    private Integer max_participation;
    /**
     * 活动排序顺序
     */
    private Integer sort_order;
    /**
     * 是否为热门活动
     */
    private Boolean is_hot;
    /**
     * 活动创建时间
     */
    private LocalDateTime create_time;
    /**
     * 活动最后更新时间
     */
    private LocalDateTime update_time;
}
