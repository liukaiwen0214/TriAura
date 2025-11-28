package com.triauras.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 生活控制器
 * 负责处理生活相关页面的跳转请求
 */
@Controller
@RequestMapping("/life")
public class LifeController {
    /**
     * 跳转到生活总览页面
     *
     * @return 生活总览页面视图名称
     */
    @RequestMapping("/life-total")
    public String lifeTotal() {
        return "life/life-total";
    }

    /**
     * 跳转到生活资产页面
     *
     * @return 生活资产页面视图名称
     */
    @RequestMapping("/life-asset")
    public String lifeAsset() {
        return "life/life-asset";
    }
}
