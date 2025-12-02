package com.triauras.controller;


import com.triauras.entity.Shikigami;
import com.triauras.service.ShikigamiService;
import com.triauras.utils.OSSUtils;
import com.triauras.vo.ResultVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 式神控制器
 * 负责处理式神相关的HTTP请求，包括页面跳转和数据接口
 */
@Slf4j
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
     */

    private final OSSUtils ossUtil = new OSSUtils();

    @RequestMapping("/all-content")
    @ResponseBody
    public ResultVO<List<Shikigami>> getAllShikigami() {
        long startTime = System.currentTimeMillis();
        // 1. 数据库查询所有式神
        List<Shikigami> shikigamis = shikigamiService.findAllShikigami();
        if (shikigamis.isEmpty()) {
            log.info("无式神数据，直接返回");
            return ResultVO.success(shikigamis);
        }
        // 2. 提取所有不重复的稀有度（减少批量查询次数）
        Set<String> rarities = shikigamis.stream().map(Shikigami::getRarity).filter(Objects::nonNull).filter(rarity -> !rarity.isEmpty()).collect(Collectors.toSet());
        // 3. 批量查询每个稀有度下的存在的头像（1次/稀有度，缓存1小时）
        Map<String, Set<String>> rarityImgMap = new HashMap<>();
        for (String rarity : rarities) {
            Set<String> existImgNames = ossUtil.batchListHeadImgNamesByRarity(rarity);
            rarityImgMap.put(rarity, existImgNames);
        }
        log.info("批量查询OSS头像（稀有度数量：{}），耗时：{}ms", rarities.size(), System.currentTimeMillis() - System.currentTimeMillis());
        // 4. 遍历式神，本地判断头像是否存在（无远程调用）
        shikigamis.forEach(shikigami -> {
            String rarity = shikigami.getRarity();
            String headImg = shikigami.getHead_image();
            // 头像为空，直接设为null
            if (headImg == null || headImg.isEmpty()) {
                shikigami.setHead_image(null);
                return;
            }

            // 从缓存中获取该稀有度下的所有存在的头像
            Set<String> existImgNames = rarityImgMap.getOrDefault(rarity, Collections.emptySet());
            if (existImgNames.contains(headImg)) {
                // 头像存在：设置代理路径（避免直接暴露OSS路径）
                shikigami.setHead_image("/util/image/" + rarity + "/" + headImg);
            } else {
                // 头像不存在：设为null并日志
                shikigami.setHead_image(null);
                log.info("式神ID为{}的头像不存在（稀有度：{}，文件名：{}）", shikigami.getShikigami_id(), rarity, headImg);
            }
        });

        log.info("获取所有式神总耗时：{}ms", System.currentTimeMillis() - startTime);
        return ResultVO.success(shikigamis);
    }

    /**
     * 根据式神ID修改式神信息
     *
     * @param shikigami 包含修改信息的式神对象
     * @return 包含操作结果的响应对象
     */
    @RequestMapping(value = "/shikigami-update", method = RequestMethod.POST)
    @ResponseBody
    public ResultVO<Shikigami> updateShikigami(@RequestBody Shikigami shikigami) {
        log.info("接收到更新式神请求，式神ID: {}, 名称: {}, 稀有度: {},声优: {},发布日期: {}",
                shikigami.getShikigami_id(), shikigami.getName(), shikigami.getRarity(),
                shikigami.getCv(), shikigami.getRelease_date());
        // 验证必要字段
        if (shikigami.getShikigami_id() == null) {
            log.error("更新式神失败：式神ID不能为空");
            return ResultVO.error("式神ID不能为空");
        }
        Shikigami existingShikigami = shikigamiService.findShikigamiById(shikigami.getShikigami_id());
        log.info("查询到的式神信息：{}", existingShikigami);
        if (existingShikigami == null) {
            log.error("更新式神失败：式神ID不存在");
            return ResultVO.error("式神ID不存在");
        }
        if (shikigami.getInteractive() == null) {
            log.info("更新式神：{}，未指定互动状态，保持原状态：{}", shikigami.getShikigami_id(), existingShikigami.getInteractive());
            shikigami.setInteractive(existingShikigami.getInteractive());
        }
        if (shikigami.getMaterial_type() == null) {
            log.info("更新式神：{}，未指定素材类型，保持原类型：{}", shikigami.getShikigami_id(), existingShikigami.getMaterial_type());
            shikigami.setMaterial_type(existingShikigami.getMaterial_type());
        }
        if (shikigami.getCreate_time() == null) {
            log.info("更新式神：{}，未指定创建时间，保持原时间：{}", shikigami.getShikigami_id(), existingShikigami.getCreate_time());
            shikigami.setCreate_time(existingShikigami.getCreate_time());
        }
        try {
            // 更新式神信息
            int updatedRows = shikigamiService.updateShikigami(shikigami);
            if (updatedRows > 0) {
                log.info("更新式神成功，式神ID: {}", shikigami.getShikigami_id());
            } else {
                log.info("更新式神失败，未影响任何行，式神ID: {}", shikigami.getShikigami_id());
                return ResultVO.error("更新式神失败：未影响任何行");
            }
            return ResultVO.success(shikigami);
        } catch (Exception e) {
            log.error("更新式神失败，式神ID: {}", shikigami.getShikigami_id(), e);
            return ResultVO.error("更新式神失败: " + e.getMessage());
        }
    }
}
