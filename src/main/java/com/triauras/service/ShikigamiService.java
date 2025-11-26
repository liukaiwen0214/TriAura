package com.triauras.service;

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
}
