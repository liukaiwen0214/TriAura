package com.triauras.service;

import com.triauras.entity.Shikigami;

import java.util.List;

/**
 * 获取式神信息工具类
 * 用于获取项目中使用的式神信息
 */
public interface ShikigamiService {
   /**
    * 获取所有式神信息
    *
    * @return 所有式神信息的列表
    */
   int fetchAndSaveShikigamiList();
   /**
    * 查询式神ID是否存在
    *
    * @param shikigamiId 式神ID
    * @return 式神信息
    */
   int findShikigamiById(int shikigamiId);
   /**
    * 查询所有式神信息
    *
    * @return 所有式神信息的列表
    */
   List<Shikigami> findAllShikigami();

   /**
    * 根据式神ID下载网易图片并上传到OSS
    * @param imgUrl 图片URL
    * @param head_name 图片名称
    * @param bucketName OSS存储桶名称
    * @param rarity 式神稀有度
    * @return 上传到OSS后的路径，如果失败返回null
    */
   String downloadAndUploadImageById(String imgUrl, String head_name, String bucketName,String rarity);
}