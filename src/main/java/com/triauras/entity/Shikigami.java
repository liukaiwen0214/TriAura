package com.triauras.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class Shikigami extends BaseEntity {

    private Integer shikigami_id;
    private String name;
    private String rarity;
    private String cv;
    private LocalDate release_date;
    private String head_image;
    private LocalDateTime create_time;
    private LocalDateTime update_time;
}
