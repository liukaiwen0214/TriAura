package com.triauras;


import com.aliyuncs.exceptions.ClientException;
import com.triauras.utils.OSSImageUtil;



public class TEST {
    public static void main(String[] args) throws Throwable {
        getAvatarUrl();
    }

    public static void getAvatarUrl() throws ClientException {
        OSSImageUtil ossImageUtil = new OSSImageUtil(
                "https://oss-cn-beijing.aliyuncs.com",
                "cn-beijing",
                "triaura",
                "Avatar/IMG_5423.jpeg"
        );
        String avatarUrl = ossImageUtil.getImageUrl();
        System.out.println(avatarUrl);
    }
}

