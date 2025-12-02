package com.triauras.utils;

import com.aliyun.oss.ClientBuilderConfiguration;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.common.auth.CredentialsProvider;
import com.aliyun.oss.common.auth.CredentialsProviderFactory;
import com.aliyun.oss.common.comm.SignVersion;
import com.aliyun.oss.model.ListObjectsRequest;
import com.aliyun.oss.model.OSSObjectSummary;
import com.aliyun.oss.model.ObjectListing;
import com.aliyuncs.exceptions.ClientException;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;


@Slf4j
public class OSSUtils {
    // ==================== 新增：静态配置 ====================
    // ENDPOINT：对象存储服务的访问域名
    private static final String DEFAULT_ENDPOINT = "https://oss-cn-beijing.aliyuncs.com";
    // REGION：OSS区域ID
    private static final String DEFAULT_REGION = "cn-beijing";
    // BUCKET_NAME：默认存储桶名称
    private static final String DEFAULT_BUCKET_NAME = "triaura";
    // HEAD_IMG_ROOT_DIR：头像存储根目录（OSS路径）
    private static final String HEAD_IMG_ROOT_DIR = "Shikigami/HeadImg/"; // 头像根目录
    // 缓存：稀有度 -> 存在的头像文件名集合（避免重复批量查询）
    private static final Map<String, Set<String>> HEAD_IMG_CACHE = new ConcurrentHashMap<>();
    // 缓存过期时间：1小时（3600秒，可调整）
    private static final long CACHE_EXPIRE_SECONDS = 3600;
    // 缓存更新时间：key=稀有度，value=最后更新时间戳
    private static final Map<String, Long> CACHE_UPDATE_TIME = new ConcurrentHashMap<>();

    private static OSS ossClient;

    /**
     * 获取单例OSS客户端（全局唯一，线程安全）
     *
     * @return OSS客户端实例
     */
    public static OSS getSingletonOssClient() {
        if (ossClient == null) {
            synchronized (OSSUtils.class) {
                if (ossClient == null) {
                    try {
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
     * 根据传入的对象名称（包含路径），生成对应的对象URL
     * 如：/Avatar/IMG_5423.jpeg
     *
     * @param objectName 对象名称（包含路径）
     * @return 对象URL
     */
    public String getObjectUrl(String objectName) {
        // 设置预签名URL过期时间，单位为毫秒。本示例以设置过期时间为1小时为例。
        Date expiration = new Date(new Date().getTime() + 3600 * 1000L);
        // 生成以GET方法访问的预签名URL。本示例没有额外请求头，其他人可以直接通过浏览器访问相关内容。
        URL url = getSingletonOssClient().generatePresignedUrl(DEFAULT_BUCKET_NAME, objectName, expiration);
        System.out.println(url);
        log.info("获取{}的URL成功,url:{}", objectName, url.toString());
        return url.toString();
    }

    /**
     * 批量查询 OSS 中「指定稀有度」目录下的所有头像文件名（缓存优化）
     *
     * @param rarity 式神稀有度（对应 OSS 目录：Shikigami/HeadImg/{rarity}/）
     * @return 存在的头像文件名集合（不含路径，仅文件名）
     */
    public Set<String> batchListHeadImgNamesByRarity(String rarity) {
        // 1. 校验稀有度
        if (rarity == null || rarity.isEmpty()) {
            log.warn("稀有度为空，返回空集合");
            // log.warn("稀有度为空，返回空集合");
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

    /**
     * 获取OSS图片输入流（改造：复用单例客户端）
     */
    public InputStream getImageInputStream(String objectName) throws ClientException, IOException {
        OSS client = getSingletonOssClient();
        try {
            Date expiration = new Date(System.currentTimeMillis() + 36000 * 1000L);
            URL url = client.generatePresignedUrl(DEFAULT_BUCKET_NAME, objectName, expiration);
            return url.openStream();
        } catch (OSSException oe) {
            log.error("获取图片输入流失败（bucket：{}，object：{}）", DEFAULT_BUCKET_NAME, objectName, oe);
            throw oe;
        }
    }
}
