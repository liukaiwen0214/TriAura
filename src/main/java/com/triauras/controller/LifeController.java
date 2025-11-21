package com.triauras.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/life")
public class LifeController {
    @RequestMapping("/life-total")
    public String lifeTotal() {
        return "life/life-total";
    }

    @RequestMapping("/life-asset")
    public String lifeAsset() {
        return "life/life-asset";
    }
}
