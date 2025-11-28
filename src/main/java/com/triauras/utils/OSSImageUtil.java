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

public class OSSImageUtil {

    private String endpoint;
    private String bucketName;
    private String region;
    private String objectName;

    public OSSImageUtil(String endpoint, String region, String bucketName, String objectName) {
        this.endpoint = endpoint;
        this.region = region;
        this.bucketName = bucketName;
        this.objectName = objectName;
    }

    public String getImageUrl() throws ClientException {
        
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();

        
        ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
        clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);

        
        OSS ossClient = OSSClientBuilder.create()
                .endpoint(endpoint)
                .credentialsProvider(credentialsProvider)
                .clientConfiguration(clientBuilderConfiguration)
                .region(region)
                .build();

        try {
            
            Date expiration = new Date(new Date().getTime() + 36000 * 1000L);
            
            URL url = ossClient.generatePresignedUrl(bucketName, objectName, expiration);
            return url.toString();
        } catch (OSSException oe) {
            
            System.out.println("Caught an OSSException, which means your request made it to OSS, "
                    + "but was rejected with an error response for some reason.");
            System.out.println("Error Message:" + oe.getErrorMessage());
            System.out.println("Error Code:" + oe.getErrorCode());
            System.out.println("Request ID:" + oe.getRequestId());
            System.out.println("Host ID:" + oe.getHostId());
            throw oe;
        } finally {
            
            ossClient.shutdown();
        }
    }

    public void uploadImage(String imgUrl, String head_name, String bucketName) throws IOException, ClientException {
        
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();

        
        ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
        clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);

        
        OSS ossClient = OSSClientBuilder.create()
                .endpoint(endpoint)
                .credentialsProvider(credentialsProvider)
                .clientConfiguration(clientBuilderConfiguration)
                .region(region)
                .build();
        
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
    public InputStream getImageInputStream() throws ClientException, IOException {
        
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();

        
        ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
        clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);

        
        OSS ossClient = OSSClientBuilder.create()
                .endpoint(endpoint)
                .credentialsProvider(credentialsProvider)
                .clientConfiguration(clientBuilderConfiguration)
                .region(region)
                .build();

        try {
            
            Date expiration = new Date(new Date().getTime() + 36000 * 1000L);
            
            URL url = ossClient.generatePresignedUrl(bucketName, objectName, expiration);

            
            return url.openStream();
        } catch (OSSException oe) {
            
            System.out.println("Caught an OSSException: ");
            System.out.println("Error Message:" + oe.getErrorMessage());
            System.out.println("Error Code:" + oe.getErrorCode());
            throw oe;
        } catch (IOException e) {
            System.out.println("Failed to open stream from URL: ");
            e.printStackTrace();
            throw e;
        } finally {
            
            ossClient.shutdown();
        }
    }
}