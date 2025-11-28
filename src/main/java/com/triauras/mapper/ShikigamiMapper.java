package com.triauras.mapper;

import com.triauras.entity.Shikigami;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ShikigamiMapper {
    int batchInsertShikigami(List<Shikigami> shikigamis);
    int findShikigamiById(int shikigamiId);
    List<Shikigami> findAllShikigami();
}
