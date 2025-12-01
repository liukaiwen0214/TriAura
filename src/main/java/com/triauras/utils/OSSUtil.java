package com.triauras.utils;

import com.aliyun.oss.ClientBuilderConfiguration;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.common.auth.CredentialsProviderFactory;
import com.aliyun.oss.common.auth.EnvironmentVariableCredentialsProvider;
import com.aliyun.oss.common.auth.CredentialsProvider;
import com.aliyun.oss.common.comm.SignVersion;
import com.aliyun.oss.model.*;
import com.aliyuncs.exceptions.ClientException;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * OSS图片工具类（优化：单例客户端复用 + 批量查询功能）
 */
@Slf4j
public class OSSUtil {

    // ==================== 新增：静态配置（请根据你的实际配置修改）====================
    private static final String DEFAULT_ENDPOINT = "https://oss-cn-beijing.aliyuncs.com";
    private static final String DEFAULT_REGION = "cn-beijing";
    private static final String DEFAULT_BUCKET_NAME = "triaura";
    private static final String HEAD_IMG_ROOT_DIR = "Shikigami/HeadImg/"; // 头像根目录

    // ==================== 新增：单例OSS客户端（线程安全，全局复用）====================
    private static volatile OSS ossClient;
    // 缓存：稀有度 -> 存在的头像文件名集合（避免重复批量查询）
    private static final Map<String, Set<String>> HEAD_IMG_CACHE = new ConcurrentHashMap<>();
    // 缓存过期时间：1小时（3600秒，可调整）
    private static final long CACHE_EXPIRE_SECONDS = 3600;
    // 缓存更新时间：key=稀有度，value=最后更新时间戳
    private static final Map<String, Long> CACHE_UPDATE_TIME = new ConcurrentHashMap<>();

    // ==================== 原有成员变量（保留）====================
    private String endpoint;
    private String bucketName;
    private String region;
    private String objectName;

    // ==================== 原有构造方法（保留，支持自定义配置）====================
    public OSSUtil(String endpoint, String region, String bucketName, String objectName) {
        this.endpoint = endpoint;
        this.region = region;
        this.bucketName = bucketName;
        this.objectName = objectName;
    }

    public OSSUtil() {
        // 默认构造：使用静态配置
        this.endpoint = DEFAULT_ENDPOINT;
        this.region = DEFAULT_REGION;
        this.bucketName = DEFAULT_BUCKET_NAME;
    }

    // ==================== 新增：单例客户端初始化（核心复用逻辑）====================
    /**
     * 获取单例OSS客户端（全局唯一，线程安全）
     */
    private static OSS getSingletonOssClient() {
        if (ossClient == null) {
            synchronized (OSSUtil.class) {
                if (ossClient == null) {
                    try {
                        // 强制设置Apache HttpClient日志级别为WARN
                        System.setProperty("org.apache.commons.logging.Log", "org.apache.commons.logging.impl.SimpleLog");
                        System.setProperty("org.apache.commons.logging.simplelog.defaultlog", "warn");
                        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http", "warn");
                        System.setProperty("org.apache.commons.logging.simplelog.log.org.apache.http.wire", "off");

                        // 加载凭证（只初始化一次）
                        CredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();
                        // 客户端配置
                        ClientBuilderConfiguration config = new ClientBuilderConfiguration();
                        config.setSignatureVersion(SignVersion.V4);
                        // 连接池配置优化
                        config.setMaxConnections(50); // 最大连接数
                        config.setConnectionTimeout(5000); // 连接超时5秒
                        config.setSocketTimeout(10000); // 读写超时10秒
                        config.setIdleConnectionTime(60000); // 空闲连接超时60秒
                        // 创建客户端
                        ossClient = OSSClientBuilder.create()
                                .endpoint(DEFAULT_ENDPOINT)
                                .region(DEFAULT_REGION)
                                .credentialsProvider(credentialsProvider)
                                .clientConfiguration(config)
                                .build();
                        log.info("OSS 单例客户端初始化成功，已强制设置Apache HttpClient日志级别为WARN");
                    } catch (ClientException e) {
                        log.error("OSS 单例客户端初始化失败", e);
                        throw new RuntimeException("OSS客户端初始化异常", e);
                    }
                }
            }
        }
        return ossClient;
    }

    /**
     * 关闭单例客户端（应用停止时调用）
     */
    public static void shutdownSingletonClient() {
        if (ossClient != null) {
            ossClient.shutdown();
            ossClient = null;
            log.info("OSS 单例客户端已关闭");
        }
    }

    // ==================== 新增：批量查询指定稀有度的所有头像文件名（核心优化）====================
    /**
     * 批量查询 OSS 中「指定稀有度」目录下的所有头像文件名（缓存优化）
     * @param rarity 式神稀有度（对应 OSS 目录：Shikigami/HeadImg/{rarity}/）
     * @return 存在的头像文件名集合（不含路径，仅文件名）
     */
    public Set<String> batchListHeadImgNamesByRarity(String rarity) {
        // 1. 校验稀有度
        if (rarity == null || rarity.isEmpty()) {
            log.warn("稀有度为空，返回空集合");
            return Collections.emptySet();
        }

        // 2. 检查缓存：未过期则直接返回
        long currentTime = System.currentTimeMillis() / 1000; // 秒级时间戳
        Long lastUpdateTime = CACHE_UPDATE_TIME.get(rarity);
        if (lastUpdateTime != null && (currentTime - lastUpdateTime) < CACHE_EXPIRE_SECONDS) {
            return HEAD_IMG_CACHE.getOrDefault(rarity, Collections.emptySet());
        }

        // 3. 缓存过期/未命中：调用OSS批量查询
        Set<String> existImgNames = new HashSet<>();
        String ossDirPrefix = HEAD_IMG_ROOT_DIR + rarity + "/"; // OSS目录前缀（如：Shikigami/HeadImg/SSR/）
        OSS client = getSingletonOssClient();

        try {
            ListObjectsRequest request = new ListObjectsRequest(DEFAULT_BUCKET_NAME)
                    .withPrefix(ossDirPrefix) // 只查询该目录下的文件
                    .withMaxKeys(1000); // 单次最多查1000个（支持分页）

            ObjectListing listing;
            do {
                listing = client.listObjects(request);
                // 遍历文件，提取文件名（去掉目录前缀）
                for (OSSObjectSummary summary : listing.getObjectSummaries()) {
                    String fullKey = summary.getKey();
                    // 例如：Shikigami/HeadImg/SSR/xxx.png → 提取 xxx.png
                    String fileName = fullKey.substring(ossDirPrefix.length());
                    if (!fileName.isEmpty()) { // 排除目录本身
                        existImgNames.add(fileName);
                    }
                }
                // 分页处理（如果文件超过1000个）
                request.setMarker(listing.getNextMarker());
            } while (listing.isTruncated());

            // 4. 更新缓存
            HEAD_IMG_CACHE.put(rarity, existImgNames);
            CACHE_UPDATE_TIME.put(rarity, currentTime);
            log.info("批量查询稀有度[{}]的头像，共找到{}个文件，已缓存", rarity, existImgNames.size());

        } catch (OSSException e) {
            log.error("OSS批量查询头像失败（目录：{}）", ossDirPrefix, e);
            existImgNames = Collections.emptySet();
        }

        return existImgNames;
    }

    // ==================== 改造原有方法：复用单例客户端（不再每次创建/关闭）====================
    /**
     * 获取OSS图片预签名URL（改造：复用单例客户端）
     */
    public String getImageUrl() throws ClientException {
        OSS client = getSingletonOssClient();
        try {
            // 优先使用实例的bucketName，无则用默认
            String bucket = this.bucketName != null ? this.bucketName : DEFAULT_BUCKET_NAME;
            Date expiration = new Date(System.currentTimeMillis() + 36000 * 1000L); // 10小时过期
            URL url = client.generatePresignedUrl(bucket, this.objectName, expiration);
            return url.toString();
        } catch (OSSException oe) {
            log.error("生成预签名URL失败（bucket：{}，object：{}）", this.bucketName, this.objectName, oe);
            throw oe;
        }
    }

    /**
     * 从指定URL下载图片并上传到OSS（改造：复用单例客户端）
     */
    public void uploadImage(String imgUrl, String head_name, String bucketName) throws IOException, ClientException {
        OSS client = getSingletonOssClient();
        try {
            String targetBucket = bucketName != null ? bucketName : DEFAULT_BUCKET_NAME;
            // 检查对象是否已存在
            if (doesObjectExist(client, targetBucket, head_name)) {
                log.info("对象已存在，无需上传：{}", head_name);
                return;
            }
            // 上传逻辑
            URL url = new URL(imgUrl);
            try (InputStream inputStream = url.openStream()) { // 自动关闭流
                PutObjectRequest putObjectRequest = new PutObjectRequest(targetBucket, this.objectName, inputStream);
                client.putObject(putObjectRequest);
                log.info("图片上传成功：{}", this.objectName);
            }
        } catch (OSSException oe) {
            log.error("上传图片失败（bucket：{}，object：{}）", bucketName, this.objectName, oe);
            throw oe;
        }
    }

    /**
     * 检查OSS对象是否存在（保留原有逻辑，支持外部传入客户端）
     */
    public boolean doesObjectExist(OSS ossClient, String bucketName, String head_name) {
        try {
            String bucket = bucketName != null ? bucketName : DEFAULT_BUCKET_NAME;
            return ossClient.doesObjectExist(bucket, head_name);
        } catch (OSSException e) {
            log.error("检查OSS对象是否存在失败（bucket：{}，object：{}）", bucketName, head_name, e);
            return false;
        }
    }

    /**
     * 重载：无客户端传入时，使用单例客户端检查
     */
    public boolean doesObjectExist(String bucketName, String head_name) {
        return doesObjectExist(getSingletonOssClient(), bucketName, head_name);
    }

    /**
     * 获取OSS图片输入流（改造：复用单例客户端）
     */
    public InputStream getImageInputStream() throws ClientException, IOException {
        OSS client = getSingletonOssClient();
        try {
            String bucket = this.bucketName != null ? this.bucketName : DEFAULT_BUCKET_NAME;
            Date expiration = new Date(System.currentTimeMillis() + 36000 * 1000L);
            URL url = client.generatePresignedUrl(bucket, this.objectName, expiration);
            return url.openStream();
        } catch (OSSException oe) {
            log.error("获取图片输入流失败（bucket：{}，object：{}）", this.bucketName, this.objectName, oe);
            throw oe;
        }
    }

    // ==================== 新增：清理指定稀有度的缓存（可选，如头像更新后调用）====================
    public static void clearHeadImgCache(String rarity) {
        HEAD_IMG_CACHE.remove(rarity);
        CACHE_UPDATE_TIME.remove(rarity);
        log.info("已清理稀有度[{}]的头像缓存", rarity);
    }

    // ==================== getter/setter（保留原有，支持动态修改配置）====================
    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getBucketName() {
        return bucketName;
    }

    public void setBucketName(String bucketName) {
        this.bucketName = bucketName;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }
}