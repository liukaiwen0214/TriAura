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
 * 阿里云OSS图片访问工具类
 * 用于处理用户头像等图片资源的访问
 */
public class OSSImageUtil {

    /**
     * OSS服务端点地址，用于连接阿里云OSS服务
     */
    private String endpoint;
    /**
     * 存储桶名称，指定图片资源存储的容器
     */
    private String bucketName;
    /**
     * 区域标识，指定OSS服务所在的数据中心区域
     */
    private String region;
    /**
     * 对象名称，指定要访问的具体图片文件路径
     */
    private String objectName;

    /**
     * 构造函数
     *
     * @param endpoint   OSS服务端点
     * @param bucketName 存储桶名称
     */
    public OSSImageUtil(String endpoint, String region, String bucketName, String objectName) {
        this.endpoint = endpoint;
        this.region = region;
        this.bucketName = bucketName;
        this.objectName = objectName;
    }

    /**
     * 获取用户头像URL
     *
     * @return 用户头像URL
     * @throws ClientException 客户端异常
     */
    public String getImageUrl() throws ClientException {
        // 从环境变量获取凭证
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();

        // 配置客户端参数
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
            // 设置预签名URL过期时间为1小时
            Date expiration = new Date(new Date().getTime() + 36000 * 1000L);
            // 生成预签名URL
            URL url = ossClient.generatePresignedUrl(bucketName, objectName, expiration);
            return url.toString();
        } catch (OSSException oe) {
            // 异常处理
            System.out.println("Caught an OSSException, which means your request made it to OSS, "
                    + "but was rejected with an error response for some reason.");
            System.out.println("Error Message:" + oe.getErrorMessage());
            System.out.println("Error Code:" + oe.getErrorCode());
            System.out.println("Request ID:" + oe.getRequestId());
            System.out.println("Host ID:" + oe.getHostId());
            throw oe;
        } finally {
            // 释放资源
            ossClient.shutdown();
        }
    }

    public void uploadImage(String imgUrl, String head_name, String bucketName) throws IOException, ClientException {
        // 从环境变量获取凭证
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();

        // 配置客户端参数
        ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
        clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);

        // 创建OSS客户端实例
        OSS ossClient = OSSClientBuilder.create()
                .endpoint(endpoint)
                .credentialsProvider(credentialsProvider)
                .clientConfiguration(clientBuilderConfiguration)
                .region(region)
                .build();
        // 从URL获取输入流
        if (doesObjectExist(ossClient, bucketName, head_name)) {
            System.out.println("对象已存在，无需上传" + head_name);
            return;
        }
        URL url = new URL(imgUrl);
        InputStream inputStream = url.openStream();
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, objectName, inputStream);
        ossClient.putObject(putObjectRequest);
        ossClient.shutdown();
    }

    public boolean doesObjectExist(OSS ossClient, String bucketName, String head_name) {
        try {
            return ossClient.doesObjectExist(bucketName, head_name);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    /**
     * 获取OSS图片输入流 (新增方法)
     * 用于代理模式下在服务器端获取图片内容
     *
     * @return OSS图片的输入流
     * @throws ClientException 客户端异常
     * @throws IOException     IO异常
     */
    public InputStream getImageInputStream() throws ClientException, IOException {
        // 从环境变量获取凭证
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();

        // 配置客户端参数
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
            // 设置预签名URL过期时间为1小时
            Date expiration = new Date(new Date().getTime() + 36000 * 1000L);
            // 生成预签名URL
            URL url = ossClient.generatePresignedUrl(bucketName, objectName, expiration);

            // 通过预签名URL获取输入流
            return url.openStream();
        } catch (OSSException oe) {
            // 异常处理
            System.out.println("Caught an OSSException: ");
            System.out.println("Error Message:" + oe.getErrorMessage());
            System.out.println("Error Code:" + oe.getErrorCode());
            throw oe;
        } catch (IOException e) {
            System.out.println("Failed to open stream from URL: ");
            e.printStackTrace();
            throw e;
        } finally {
            // 释放资源
            ossClient.shutdown();
        }
    }
}