package com.triauras.entity.tools;

import lombok.Data;

import java.util.List;

@Data
public class DataVO {
    // 错误：private List<DefaultGroupVO> customDefaultGroups;
    private List<CustomGroupVO> customGroups;
    private List<DefaultGroupVO> defaultGroups;
}
