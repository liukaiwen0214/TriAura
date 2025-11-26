package com.triauras.mapper;

import com.triauras.entity.Shikigami;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 式神映射器接口
 * 用于数据库操作的Mapper接口
 */
@Mapper
public interface ShikigamiMapper {
    /**
     * 批量插入式神数据
     *
     * @param shikigamis 式神数据列表
     * @return 插入的行数
     */
    int batchInsertShikigami(List<Shikigami> shikigamis);
     /**
     * 查询式神ID是否存在
     *
     * @param shikigamiId 式神ID
     * @return 式神信息
     */
    int findShikigamiById(int shikigamiId);
}
