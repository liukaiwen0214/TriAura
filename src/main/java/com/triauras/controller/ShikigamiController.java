package com.triauras.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/shikigami")
public class ShikigamiController {
    @RequestMapping("/record")
    public String shikigamiTable() {
        return "shikigami/shikigami-record";
    }
}
