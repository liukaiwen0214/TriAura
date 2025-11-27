package com.triauras.service.impl;

import com.aliyun.oss.OSSClient;
import com.aliyuncs.exceptions.ClientException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.triauras.entity.Shikigami;
import com.triauras.mapper.ShikigamiMapper;
import com.triauras.service.ShikigamiService;
import com.aliyun.oss.ClientBuilderConfiguration;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.common.auth.CredentialsProviderFactory;
import com.aliyun.oss.common.auth.EnvironmentVariableCredentialsProvider;
import com.aliyun.oss.common.comm.SignVersion;
import com.triauras.utils.OSSImageUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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
 * 获取式神信息工具类实现类
 * 用于获取项目中使用的式神信息
 */
@Service
public class ShikigamiServiceImpl implements ShikigamiService {
    private static final Logger logger = LogManager.getLogger(ShikigamiServiceImpl.class);
    private final ShikigamiMapper shikigamiMapper;
    private OSSClient ossClient;

    /**
     * 构造函数，用于依赖注入
     *
     * @param shikigamiMapper 式神数据映射器
     */
    public ShikigamiServiceImpl(ShikigamiMapper shikigamiMapper) {
        this.shikigamiMapper = shikigamiMapper;
    }

    /**
     * 获取所有式神信息
     *
     * @return 所有式神信息的列表
     */
    @Override
    public int fetchAndSaveShikigamiList() {
        String urlStr = "https://yys.res.netease.com/pc/zt/20161108171335/js/app/all_shishen.json";
        String StoryUrlStr = "https://g37simulator.webapp.163.com/get_hero_story?heroid=";
        try {
            logger.info("开始获取式神信息");
            String response = sendGetRequest(urlStr);
            ObjectMapper mapper = new ObjectMapper();
            ObjectMapper storyMapper = new ObjectMapper();
            JsonNode node = mapper.readTree(response);
            List<Shikigami> shikigamis = new ArrayList<>();

            // 检查是否为数组格式
            if (node.isArray()) {
                // 遍历数组中的每个元素
                for (JsonNode item : node) {
                    // 创建Shikigami对象
                    Shikigami shikigami = new Shikigami();
                    // 提取id字段并转换为整数
                    if (item.has("id")) {
                        shikigami.setShikigami_id(Integer.parseInt(item.get("id").asText()));
                        shikigami.setHead_image(Integer.parseInt(item.get("id").asText()) + ".png"); // 默认值
                    }
                    // 提取name字段
                    if (item.has("name")) {
                        shikigami.setName(item.get("name").asText());
                    }
                    // 提取level字段（对应稀有度）
                    if (item.has("level")) {
                        String level = item.get("level").asText();
                        shikigami.setRarity(level);
                    }
                    // 发送GET请求获取式神详情
                    String storyResponse = sendGetRequest(StoryUrlStr + shikigami.getShikigami_id());
                    // 解析式神详情JSON
                    JsonNode storyNode = storyMapper.readTree(storyResponse);
                    if (storyNode.has("data")) {
                        JsonNode dataNode = storyNode.get("data");
                        if (dataNode.has("cv")) {
                            shikigami.setCv(dataNode.get("cv").asText());
                        }
                    }


                    // 设置其他必要字段的默认值
                    shikigami.setRelease_date(LocalDate.now()); // 默认值
                    shikigami.setCreate_time(LocalDateTime.now());
                    shikigami.setUpdate_time(LocalDateTime.now());
                    shikigamis.add(shikigami);
                }
            } else {
                // 兼容旧格式的逻辑（如果需要）
                System.out.println("JSON不是数组格式，可能是旧格式");
            }

            System.out.println("解析完成，共获取到 " + shikigamis.size() + " 条式神数据");
            // 保存到数据库
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

    @Override
    public int findShikigamiById(int shikigamiId) {
        return shikigamiMapper.findShikigamiById(shikigamiId);
    }

    @Override
    public List<Shikigami> findAllShikigami() {
        return shikigamiMapper.findAllShikigami();
    }

    /**
     * 发送GET请求并返回响应内容
     *
     * @param urlStr 请求URL
     * @return 响应内容
     * @throws Exception 如果请求失败
     */
    private String sendGetRequest(String urlStr) throws Exception {
        URL url = new URL(urlStr);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(5000);
        connection.setReadTimeout(5000);

        StringBuilder response = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
        }

        connection.disconnect();
        return response.toString();
    }

    public int batchSaveShikigamis(List<Shikigami> shikigamis) {
        for (Shikigami shikigami : shikigamis) {
            if (shikigamiMapper.findShikigamiById(shikigami.getShikigami_id()) != 0) {
                logger.info("重复式神ID: {} 不添加到数据库", shikigami.getShikigami_id());
                System.out.println("重复式神ID: " + shikigami.getShikigami_id() + "不添加到数据库");
            } else {
                shikigamiMapper.batchInsertShikigami(List.of(shikigami));
            }
        }
        return shikigamis.size();
    }

    @Override
    public String downloadAndUploadImageById(String imgUrl, String head_name, String bucketName, String rarity) {
        OSSImageUtil ossImageUtil = new OSSImageUtil(
                "https://oss-cn-beijing.aliyuncs.com",
                "cn-beijing",
                bucketName,
                "Shikigami/HeadImg/" + rarity + "/" + head_name
        );
        try {
            ossImageUtil.uploadImage(imgUrl, head_name, bucketName);
        } catch (IOException | ClientException e) {
            throw new RuntimeException(e);
        }
        return null;
    }
}