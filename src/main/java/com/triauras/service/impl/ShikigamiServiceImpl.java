package com.triauras.service.impl;


import com.aliyuncs.exceptions.ClientException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.triauras.entity.Shikigami;
import com.triauras.mapper.ShikigamiMapper;
import com.triauras.service.ShikigamiService;
import com.triauras.utils.OSSUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.io.*;

/**
 * 式神服务实现类
 * 负责式神数据的获取、保存、查询和图片处理等核心业务逻辑
 */
@Service
public class ShikigamiServiceImpl implements ShikigamiService {
    private static final Logger logger = LoggerFactory.getLogger(ShikigamiServiceImpl.class);
    private final ShikigamiMapper shikigamiMapper;

    /**
     * 构造函数，依赖注入式神映射器
     *
     * @param shikigamiMapper 式神数据访问对象
     */
    public ShikigamiServiceImpl(ShikigamiMapper shikigamiMapper) {
        this.shikigamiMapper = shikigamiMapper;
    }

    /**
     * 从外部API获取式神数据并保存到数据库
     *
     * @return 成功保存的式神数量
     */
    @Override
    public int fetchAndSaveShikigamiList() {
        String ShisHenUrl = "https://yys.res.netease.com/pc/zt/20161108171335/js/app/all_shishen.json";
        String StoryUrlStr = "https://g37simulator.webapp.163.com/get_hero_story?heroid=";
        String InteractiveMaterial_typeUrl = "https://g37simulator.webapp.163.com/get_heroid_list?rarity=0&page=1&per_page=500";
        try {
            logger.info("开始获取式神信息");
            // 发送HTTP请求获取式神列表数据
            String response = sendGetRequest(ShisHenUrl);
            ObjectMapper mapper = new ObjectMapper();
            ObjectMapper storyMapper = new ObjectMapper();
            JsonNode node = mapper.readTree(response);
            List<Shikigami> shikigamis = new ArrayList<>();

            // 解析JSON数组格式的式神数据
            if (node.isArray()) {
                // 遍历每个式神节点，构建式神对象
                for (JsonNode item : node) {
                    Shikigami shikigami = new Shikigami();

                    // 设置式神基本信息
                    if (item.has("id")) {
                        shikigami.setShikigami_id(Integer.parseInt(item.get("id").asText()));
                        shikigami.setHead_image(Integer.parseInt(item.get("id").asText()) + ".png");
                    }
                    if (item.has("name")) {
                        shikigami.setName(item.get("name").asText());
                    }
                    if (item.has("level")) {
                        String level = item.get("level").asText();
                        shikigami.setRarity(level);
                    }

                    // 获取式神详细信息（声优）
                    String storyResponse = sendGetRequest(StoryUrlStr + shikigami.getShikigami_id());
                    JsonNode storyNode = storyMapper.readTree(storyResponse);
                    if (storyNode.has("data")) {
                        JsonNode dataNode = storyNode.get("data");
                        if (dataNode.has("cv")) {
                            shikigami.setCv(dataNode.get("cv").asText());
                        }
                    }
                    String interactiveMaterial_typeResponse = sendGetRequest(InteractiveMaterial_typeUrl);
                    JsonNode interactiveMaterial_typeNode = storyMapper.readTree(interactiveMaterial_typeResponse);
                    if (interactiveMaterial_typeNode.has("data")) {
                        JsonNode dataNode = interactiveMaterial_typeNode.get("data").get(shikigami.getShikigami_id().toString());
                        if (dataNode.has("interactive")) {
                            shikigami.setInteractive(dataNode.get("interactive").asInt());
                        }
                        if (dataNode.has("material_type")) {
                            shikigami.setMaterial_type(dataNode.get("material_type").asInt());
                        }
                    }
                    // 设置默认值和时间戳
                    shikigami.setRelease_date(LocalDate.now());
                    shikigami.setCreate_time(LocalDateTime.now());
                    shikigami.setUpdate_time(LocalDateTime.now());
                    shikigamis.add(shikigami);
                }
            } else {
                // 兼容旧格式的处理逻辑
                System.out.println("JSON不是数组格式，可能是旧格式");
            }

            System.out.println("解析完成，共获取到 " + shikigamis.size() + " 条式神数据");
            System.out.println("开始保存到数据库");
            if (!shikigamis.isEmpty()) {
                return batchSaveShikigamis(shikigamis);
            }
        } catch (Exception e) {
            logger.error("获取和保存式神数据失败", e);
            throw new RuntimeException(e);
        }
        return 0;
    }

    /**
     * 根据ID查询式神是否存在
     *
     * @param shikigamiId 式神ID
     * @return 1表示存在，0表示不存在
     */
    @Override
    public int findShikigamiById(int shikigamiId) {
        return shikigamiMapper.findShikigamiById(shikigamiId);
    }

    /**
     * 查询所有式神信息
     *
     * @return 式神列表
     */
    @Override
    public List<Shikigami> findAllShikigami() {
        return shikigamiMapper.findAllShikigami();
    }

    @Override
    public int updateShikigami(Shikigami shikigami) {
        logger.info("执行更新式神操作，式神ID: {}", shikigami.getShikigami_id());
        // 设置更新时间
        shikigami.setUpdate_time(LocalDateTime.now());
        return shikigamiMapper.updateShikigami(shikigami);
    }

    /**
     * 发送HTTP GET请求获取响应内容
     *
     * @param urlStr 请求URL
     * @return 响应内容字符串
     * @throws Exception 请求失败时抛出异常
     */
    private String sendGetRequest(String urlStr) throws Exception {
        URL url = new URL(urlStr);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(5000);
        connection.setReadTimeout(5000);

        StringBuilder response = new StringBuilder();
        // 读取响应内容
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
        }

        connection.disconnect();
        return response.toString();
    }

    /**
     * 批量保存式神数据到数据库
     *
     * @param shikigamis 式神列表
     * @return 处理的式神数量
     */
    public int batchSaveShikigamis(List<Shikigami> shikigamis) {
        for (Shikigami shikigami : shikigamis) {
            // 检查式神是否已存在，避免重复插入
            if (shikigamiMapper.findShikigamiById(shikigami.getShikigami_id()) != 0) {
                logger.info("重复式神ID: {} 不添加到数据库", shikigami.getShikigami_id());
                System.out.println("重复式神ID: " + shikigami.getShikigami_id() + "不添加到数据库");
            } else {
                // 单个插入，避免批量插入的复杂性
                shikigamiMapper.batchInsertShikigami(List.of(shikigami));
            }
        }
        return shikigamis.size();
    }

    /**
     * 根据ID下载并上传式神图片到OSS
     *
     * @param imgUrl     图片源URL
     * @param head_name  图片文件名
     * @param bucketName OSS存储桶名称
     * @param rarity     式神稀有度
     * @return 上传结果
     */
    @Override
    public String downloadAndUploadImageById(String imgUrl, String head_name, String bucketName, String rarity) {
        OSSUtil ossUtil = new OSSUtil(
                "https://oss-cn-beijing.aliyuncs.com",
                "cn-beijing",
                bucketName,
                "Shikigami/HeadImg/" + rarity + "/" + head_name
        );
        try {
            // 下载并上传图片到OSS
            ossUtil.uploadImage(imgUrl, head_name, bucketName);
        } catch (IOException | ClientException e) {
            throw new RuntimeException(e);
        }
        return null;
    }
}