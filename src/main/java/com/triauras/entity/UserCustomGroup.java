package com.triauras.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserCustomGroup {
    /**
     * 自定义分组唯一标识ID
     */
    private int group_id;
    /**
     * 关联用户ID（归属用户），关联users表的id字段
     */
    private Long user_id;
    /**
     * 自定义分组名称
     */
    private String group_name;
    /**
     * 自定义分组排序（用于显示顺序）
     */
    private Integer sort;
    /**
     * 创建时间
     */
    private LocalDateTime created_at;
    /**
     * 最后更新时间
     */
    private LocalDateTime updated_at;
    /**
     * 软删除标识：0=未删除，1=已删除
     */
    private Integer is_deleted;
}
