package com.triauras.utils;

import com.aliyun.oss.ClientBuilderConfiguration;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.common.auth.CredentialsProviderFactory;
import com.aliyun.oss.common.auth.EnvironmentVariableCredentialsProvider;
import com.aliyun.oss.common.comm.SignVersion;
import com.aliyun.oss.model.PutObjectRequest;
import com.aliyuncs.exceptions.ClientException;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;

/**
 * OSS图片工具类
 * 用于处理OSS图片的上传、获取预签名URL和获取输入流等操作
 */
public class OSSImageUtil {

    /**
     * OSS服务端点
     */
    private String endpoint;
    
    /**
     * OSS存储桶名称
     */
    private String bucketName;
    
    /**
     * OSS区域
     */
    private String region;
    
    /**
     * OSS对象名称
     */
    private String objectName;

    /**
     * 构造函数，初始化OSS图片工具
     *
     * @param endpoint   OSS服务端点
     * @param region     OSS区域
     * @param bucketName OSS存储桶名称
     * @param objectName OSS对象名称
     */
    public OSSImageUtil(String endpoint, String region, String bucketName, String objectName) {
        this.endpoint = endpoint;
        this.region = region;
        this.bucketName = bucketName;
        this.objectName = objectName;
    }

    /**
     * 获取OSS图片预签名URL
     *
     * @return 预签名URL字符串
     * @throws ClientException OSS客户端异常
     */
    public String getImageUrl() throws ClientException {
        // 使用环境变量获取凭证
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();

        // 配置OSS客户端
        ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
        clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);

        // 创建OSS客户端实例
        OSS ossClient = OSSClientBuilder.create()
                .endpoint(endpoint)
                .credentialsProvider(credentialsProvider)
                .clientConfiguration(clientBuilderConfiguration)
                .region(region)
                .build();

        try {
            // 设置URL过期时间为10小时
            Date expiration = new Date(new Date().getTime() + 36000 * 1000L);
            // 生成预签名URL
            URL url = ossClient.generatePresignedUrl(bucketName, objectName, expiration);
            return url.toString();
        } catch (OSSException oe) {
            // 处理OSS服务端异常
            System.out.println("Caught an OSSException, which means your request made it to OSS, "
                    + "but was rejected with an error response for some reason.");
            System.out.println("Error Message:" + oe.getErrorMessage());
            System.out.println("Error Code:" + oe.getErrorCode());
            System.out.println("Request ID:" + oe.getRequestId());
            System.out.println("Host ID:" + oe.getHostId());
            throw oe;
        } finally {
            // 关闭OSS客户端
            ossClient.shutdown();
        }
    }

    /**
     * 从指定URL下载图片并上传到OSS
     *
     * @param imgUrl     图片源URL
     * @param head_name  图片文件名
     * @param bucketName OSS存储桶名称
     * @throws IOException     IO异常
     * @throws ClientException OSS客户端异常
     */
    public void uploadImage(String imgUrl, String head_name, String bucketName) throws IOException, ClientException {
        // 使用环境变量获取凭证
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();

        // 配置OSS客户端
        ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
        clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);

        // 创建OSS客户端实例
        OSS ossClient = OSSClientBuilder.create()
                .endpoint(endpoint)
                .credentialsProvider(credentialsProvider)
                .clientConfiguration(clientBuilderConfiguration)
                .region(region)
                .build();
        
        // 检查对象是否已存在，避免重复上传
        if (doesObjectExist(ossClient, bucketName, head_name)) {
            System.out.println("对象已存在，无需上传" + head_name);
            return;
        }
        
        // 从URL获取输入流并上传到OSS
        URL url = new URL(imgUrl);
        InputStream inputStream = url.openStream();
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, objectName, inputStream);
        ossClient.putObject(putObjectRequest);
        ossClient.shutdown();
    }

    /**
     * 检查OSS对象是否存在
     *
     * @param ossClient  OSS客户端实例
     * @param bucketName OSS存储桶名称
     * @param head_name  图片文件名
     * @return 对象存在返回true，否则返回false
     */
    public boolean doesObjectExist(OSS ossClient, String bucketName, String head_name) {
        try {
            return ossClient.doesObjectExist(bucketName, head_name);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * 获取OSS图片输入流
     *
     * @return 图片输入流
     * @throws ClientException OSS客户端异常
     * @throws IOException     IO异常
     */
    public InputStream getImageInputStream() throws ClientException, IOException {
        // 使用环境变量获取凭证
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();

        // 配置OSS客户端
        ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
        clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);

        // 创建OSS客户端实例
        OSS ossClient = OSSClientBuilder.create()
                .endpoint(endpoint)
                .credentialsProvider(credentialsProvider)
                .clientConfiguration(clientBuilderConfiguration)
                .region(region)
                .build();

        try {
            // 设置URL过期时间为10小时
            Date expiration = new Date(new Date().getTime() + 36000 * 1000L);
            // 生成预签名URL
            URL url = ossClient.generatePresignedUrl(bucketName, objectName, expiration);
            // 打开URL连接并返回输入流
            return url.openStream();
        } catch (OSSException oe) {
            // 处理OSS服务端异常
            System.out.println("Caught an OSSException: ");
            System.out.println("Error Message:" + oe.getErrorMessage());
            System.out.println("Error Code:" + oe.getErrorCode());
            throw oe;
        } catch (IOException e) {
            // 处理IO异常
            System.out.println("Failed to open stream from URL: ");
            e.printStackTrace();
            throw e;
        } finally {
            // 关闭OSS客户端
            ossClient.shutdown();
        }
    }
}