package com.triauras.controller;

import com.triauras.entity.Shikigami;
import com.triauras.service.ShikigamiService;
import com.triauras.vo.ResultVO;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * 式神控制器
 * 负责处理式神相关的HTTP请求，包括页面跳转和数据接口
 */
@Controller
@RequestMapping("/shikigami")
public class ShikigamiController {
    private final ShikigamiService shikigamiService;

    /**
     * 构造函数，依赖注入式神服务
     *
     * @param shikigamiService 式神服务对象
     */
    public ShikigamiController(ShikigamiService shikigamiService) {
        this.shikigamiService = shikigamiService;
    }

    /**
     * 跳转到式神记录页面
     *
     * @return 式神记录页面视图名称
     */
    @RequestMapping("/record")
    public String shikigamiTable() {
        return "shikigami/shikigami-record";
    }

    /**
     * 获取所有式神信息
     *
     * @return 包含式神列表的响应对象
     */
    @RequestMapping("/all-content")
    @ResponseBody
    public ResultVO<List<Shikigami>> getAllShikigami() {
        // 查询所有式神
        List<Shikigami> shikigamis = shikigamiService.findAllShikigami();

        // 设置头像相对路径，指向UtilController中的代理方法
        shikigamis.forEach(shikigami -> {
            if (shikigami.getHead_image() != null && !shikigami.getHead_image().isEmpty()) {
                shikigami.setHead_image("/util/image/" + shikigami.getRarity() + "/" + shikigami.getHead_image());
            }
        });
        return ResultVO.success(shikigamis);
    }
}
