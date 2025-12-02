package com.triauras.utils;

import com.aliyuncs.exceptions.ClientException;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * OSS连接池配置测试
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class OSSUtilConnectionTest {

    @Test
    public void testConnectionPoolConfiguration() throws ClientException {
        // 创建OSSUtil实例
        OSSUtil ossUtil = new OSSUtil();

        // 测试连接池配置是否生效
        String result = ossUtil.getImageUrl();
        assertNotNull(result, "OSS连接应该成功建立");

        System.out.println("OSS连接池测试成功，配置已生效");
    }

    @AfterAll
    public static void tearDown() {
        // 清理连接池
        OSSUtil.shutdownSingletonClient();
    }
}
