package com.triauras;

import com.aliyun.oss.ClientBuilderConfiguration;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.common.auth.CredentialsProviderFactory;
import com.aliyun.oss.common.auth.EnvironmentVariableCredentialsProvider;
import com.aliyun.oss.common.comm.SignVersion;
import com.aliyun.oss.model.PutObjectRequest;
import com.aliyun.oss.model.PutObjectResult;
import com.aliyuncs.exceptions.ClientException;
import com.triauras.utils.OSSImageUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Properties;


public class TEST {
    public static void main(String[] args) throws Throwable, ClientException {
        getAvatarUrl();
    }

    public static void getAvatarUrl() throws ClientException {
        OSSImageUtil ossImageUtil = new OSSImageUtil(
                "https:
                "cn-beijing",
                "triaura",
                "Avatar/IMG_5423.jpeg"
        );
        String avatarUrl = ossImageUtil.getImageUrl();
        System.out.println(avatarUrl);
    }
}

