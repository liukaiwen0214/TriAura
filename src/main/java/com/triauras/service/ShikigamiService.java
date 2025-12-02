package com.triauras.service;

import com.triauras.entity.Shikigami;

import java.util.List;

public interface ShikigamiService {
   /**
    * 从外部接口获取式神列表并保存到数据库
    *
    * @return 成功保存的记录数
    */
   int fetchAndSaveShikigamiList();
   /**
    * 根据式神ID查询式神信息
    *
    * @param shikigamiId 式神ID
    * @return 式神对象
    */
   Shikigami findShikigamiById(int shikigamiId);
   /**
    * 查询所有式神信息
    *
    * @return 式神对象列表
    */
   List<Shikigami> findAllShikigami();
   /**
    * 更新式神信息
    *
    * @param shikigami 包含更新信息的式神对象
    * @return 更新成功的记录数
    */
   int updateShikigami(Shikigami shikigami);
   /**
    * 下载并上传式神头像到OSS
    *
    * @param imgUrl    式神头像URL
    * @param head_name 式神名称，用于OSS文件名
    * @param bucketName OSS存储桶名称
    * @param rarity    式神稀有度，用于OSS目录名
    * @return 上传后的OSS图片URL
    */
   String downloadAndUploadImageById(String imgUrl, String head_name, String bucketName,String rarity);
}