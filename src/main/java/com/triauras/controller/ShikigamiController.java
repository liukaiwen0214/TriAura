package com.triauras.controller;

import com.triauras.entity.Shikigami;
import com.triauras.service.ShikigamiService;
import com.triauras.vo.ResultVO;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


import java.util.List;


@Controller
@RequestMapping("/shikigami")
public class ShikigamiController {
    private final ShikigamiService shikigamiService;

    public ShikigamiController(ShikigamiService shikigamiService) {
        this.shikigamiService = shikigamiService;
    }

    @RequestMapping("/record")
    public String shikigamiTable() {
        return "shikigami/shikigami-record";
    }

    @RequestMapping("/all-content")
    @ResponseBody
    public ResultVO<List<Shikigami>> getAllShikigami() {
        List<Shikigami> shikigamis = shikigamiService.findAllShikigami();

        // 不再直接设置OSS预签名URL，而是设置相对路径指向MessageController中的代理方法
        shikigamis.forEach(shikigami -> {
            if (shikigami.getHead_image() != null && !shikigami.getHead_image().isEmpty()) {
                // 修改路径为指向MessageController中的代理方法
                shikigami.setHead_image("/util/image/" + shikigami.getRarity() + "/" + shikigami.getHead_image());
            }
        });
        return ResultVO.success(shikigamis);
    }

}
