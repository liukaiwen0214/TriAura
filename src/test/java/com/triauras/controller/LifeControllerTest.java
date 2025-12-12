package com.triauras.controller;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


// Lombok的日志注解（需确保引入Lombok依赖）
@Slf4j
// JUnit5的Spring扩展（替代JUnit4的@RunWith）
@ExtendWith(SpringExtension.class)
// 关键：启用Web环境，创建WebApplicationContext Bean
@WebAppConfiguration
// 加载SSM的配置文件（路径需与项目实际一致）
@ContextConfiguration(locations = {
        "classpath:/config/applicationContext.xml",   // Spring核心配置（Service、Mapper）
        "classpath:/config/springmvc-servlet.xml"    // SpringMVC配置（Controller、注解驱动等）
})
class LifeControllerTest {
    // 注入SpringMVC的WebApplicationContext
    @Autowired
    private WebApplicationContext webApplicationContext;

    // 模拟HTTP请求的核心对象
    private MockMvc mockMvc;

    // 每个测试方法执行前初始化MockMvc

    @BeforeEach
    public void setup() {
        // 从WebApplicationContext构建MockMvc（推荐方式，能加载完整的SpringMVC配置）
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void getTaskData() throws Exception {
        // 1. 模拟GET请求：/task/getData?userId=1
        ResultActions resultActions = mockMvc.perform(
                get("/life/getData") // 请求路径
                        .param("userId", "1") // 请求参数
                        .contentType(MediaType.APPLICATION_JSON) // 请求头类型
        );

        // 2. 验证响应结果（核心断言）
        resultActions
                // 验证响应状态码：200 OK
                .andExpect(status().isOk())
                // 验证响应体的JSON字段：code=200
                .andExpect(jsonPath("$.code").value(200))
                // 验证响应体的JSON字段：message=操作成功
                .andExpect(jsonPath("$.message").value("操作成功"))
                // 验证响应体的data.customGroups不为空
                .andExpect(jsonPath("$.data.customGroups").isNotEmpty())
                // 验证第一个自定义分组的groupName为"项目A任务"
                .andExpect(jsonPath("$.data.customGroups[0].groupName").value("项目A任务"))
                // 可选：打印完整的响应内容（方便调试）
                .andDo(result -> System.out.println("响应内容：" + result.getResponse().getContentAsString()));

    }
}