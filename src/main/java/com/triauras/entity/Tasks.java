package com.triauras.entity;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class Tasks {
    /**
     * 待办事项唯一标识ID
     */
    private Long id;

    /**
     * 关联用户ID（归属用户），关联users表的id字段
     */
    private Long user_id;

    /**
     * 待办事项标题
     */
    private String title;

    /**
     * 待办事项详细描述
     */
    private String description;
    /**
     * 任务标签，多个标签用英文逗号分隔（如：工作,学习,家庭）
     */
    private String tags;

    /**
     * 待办截止时间
     */
    private LocalDateTime deadline;

    /**
     * 待办优先级：1=低优先级，2=中优先级，3=高优先级
     */
    private Integer priority;

    /**
     * 待办状态：0=未开始，1=进行中，2=已完成，3=已取消
     */
    private Integer status;

    /**
     * 待办创建时间
     */
    private LocalDateTime created_at;

    /**
     * 最后更新时间
     */
    private LocalDateTime updated_at;

    /**
     * 待办完成时间（仅状态为已完成时填充）
     */
    private LocalDateTime completed_at;

    /**
     * 待办提醒时间
     */
    private LocalDateTime reminder_time;

    /**
     * 软删除标识：0=未删除，1=已删除
     */
    private Integer is_deleted;
}
