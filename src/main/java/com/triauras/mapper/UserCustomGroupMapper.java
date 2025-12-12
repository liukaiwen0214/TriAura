package com.triauras.mapper;

import com.triauras.entity.UserCustomGroup;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserCustomGroupMapper {

    /**
     * 根据用户ID查询自定义分组（未删除）
     *
     * @param userId    用户ID
     * @param isDeleted 是否删除
     * @return 自定义分组列表
     */
    List<UserCustomGroup> selectByUserId(
            @Param("userId") Integer userId,
            @Param("isDeleted") Integer isDeleted
    );
}