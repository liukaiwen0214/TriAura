package com.triauras.mapper;

import com.triauras.entity.Shikigami;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ShikigamiMapper {
    /**
     * 批量插入式神信息
     *
     * @param shikigamis 式神对象列表
     * @return 插入成功的记录数
     */
    int batchInsertShikigami(List<Shikigami> shikigamis);
    /**
     * 根据式神ID查询式神信息
     *
     * @param shikigamiId 式神ID
     * @return 式神对象
     */
    int findShikigamiById(int shikigamiId);
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
}
