package com.triauras;

import com.aliyun.oss.ClientBuilderConfiguration;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.common.auth.CredentialsProviderFactory;
import com.aliyun.oss.common.auth.EnvironmentVariableCredentialsProvider;
import com.aliyun.oss.common.comm.SignVersion;
import com.aliyuncs.exceptions.ClientException;
import com.triauras.utils.OSSUtil;

public class TEST {
    public static void main(String[] args) throws ClientException {
        // 使用环境变量获取凭证
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();

        // 配置OSS客户端
        ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
        clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);

        // 创建OSS客户端实例
        OSS ossClient = OSSClientBuilder.create()
                .endpoint("https://oss-cn-beijing.aliyuncs.com")
                .credentialsProvider(credentialsProvider)
                .clientConfiguration(clientBuilderConfiguration)
                .region("cn-beijing")
                .build();
        OSSUtil ossUtil = new OSSUtil();
        ossUtil.doesObjectExist(ossClient,"triaura","Shikigami/HeadImg/UR/1.png");
        // 可以在这里添加适当的日志记录，而不是直接输出到控制台
    }

}

