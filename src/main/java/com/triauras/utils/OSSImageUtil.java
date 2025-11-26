package com.triauras.utils;

import com.aliyun.oss.ClientBuilderConfiguration;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.common.auth.CredentialsProviderFactory;
import com.aliyun.oss.common.auth.EnvironmentVariableCredentialsProvider;
import com.aliyun.oss.common.comm.SignVersion;
import com.aliyuncs.exceptions.ClientException;

import java.net.URL;
import java.util.Date;

/**
 * 阿里云OSS图片访问工具类
 * 用于处理用户头像等图片资源的访问
 */
public class OSSImageUtil {

    // 阿里云OSS配置信息
    private String endpoint;
    private String bucketName;
    private String region;
    private String objectName;

    // OSS客户端
    private OSS ossClient;

    /**
     * 构造函数
     * @param endpoint OSS服务端点
     * @param bucketName 存储桶名称
     */
    public OSSImageUtil(String endpoint, String region, String bucketName, String objectName) {
        this.endpoint = endpoint;
        this.region = region;
        this.bucketName = bucketName;
        this.objectName = objectName;
    }

    public String getAvatarUrl() throws ClientException {
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();
        // 创建OSSClient实例。
        // 当OSSClient实例不再使用时，调用shutdown方法以释放资源。
        ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
        clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);
        OSS ossClient = OSSClientBuilder.create()
                .endpoint(endpoint)
                .credentialsProvider(credentialsProvider)
                .clientConfiguration(clientBuilderConfiguration)
                .region(region)
                .build();
        try {
            // 设置预签名URL过期时间，单位为毫秒。本示例以设置过期时间为1小时为例。
            Date expiration = new Date(new Date().getTime() + 36000 * 1000L);
            // 生成以GET方法访问的预签名URL。本示例没有额外请求头，其他人可以直接通过浏览器访问相关内容。
            URL url = ossClient.generatePresignedUrl(bucketName, objectName, expiration);
            return url.toString();
        }catch (OSSException oe) {
            System.out.println("Caught an OSSException, which means your request made it to OSS, "
                    + "but was rejected with an error response for some reason.");
            System.out.println("Error Message:" + oe.getErrorMessage());
            System.out.println("Error Code:" + oe.getErrorCode());
            System.out.println("Request ID:" + oe.getRequestId());
            System.out.println("Host ID:" + oe.getHostId());
        } finally {
            ossClient.shutdown();
        }
        return "获取头像URL失败";
    }
}