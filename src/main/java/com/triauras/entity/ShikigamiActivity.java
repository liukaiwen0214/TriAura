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
     * 关联的副本ID
     */
    private Integer dungeon_id;
    /**
     * 活动创建时间
     */
    private LocalDateTime create_time;
    /**
     * 活动最后更新时间
     */
    private LocalDateTime update_time;
}
