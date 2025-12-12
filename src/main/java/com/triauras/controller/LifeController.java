package com.triauras.controller;

import com.triauras.entity.Tasks;
import com.triauras.entity.tools.DataVO;
import com.triauras.service.GeneralService;
import com.triauras.service.TasksService;
import com.triauras.vo.ResultVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 生活控制器
 * 负责处理生活相关页面的跳转请求
 */
@Slf4j
@Controller
@RequestMapping("/life")
public class LifeController {
    private final TasksService tasksService;
    private final GeneralService generalService;

    public LifeController(TasksService tasksService, GeneralService generalService) {
        this.tasksService = tasksService;
        this.generalService = generalService;
    }

    /**
     * 跳转到生活总览页面
     *
     * @return 生活总览页面视图名称
     */
    @RequestMapping("/life-total")
    public String lifeTotal() {
        return "life/life-total";
    }

    @RequestMapping("/get-tasks")
    @ResponseBody
    public ResultVO<Map<String, Object>> getAllTasks(@RequestBody Map<String, Object> requestBody) {
        try {
            Integer userId = null;
            if (requestBody != null && requestBody.containsKey("userId")) {
                userId = Integer.valueOf(requestBody.get("userId").toString());
            }

            if (userId == null) {
                log.warn("获取任务列表失败：用户ID为空");
                return ResultVO.error("用户ID不能为空");
            }
            Map<String, Object> response = new HashMap<>();

            // 1. 任务列表
            List<Tasks> tasks = tasksService.getToDoList(userId);
            response.put("tasks", tasks);
            // 2. 任务统计
            Map<String, Integer> statistics = tasksService.getToDoListStatistics(userId);
            response.put("statistics", statistics);

            log.info("获取用户 {} 的任务列表", userId);
            return ResultVO.success(response);
        } catch (Exception e) {
            log.error("获取任务列表异常", e);
            return ResultVO.error("获取任务列表失败");
        }
    }

    @RequestMapping("/getData")
    @ResponseBody
    public ResultVO<DataVO> getLifeData(@RequestParam("userId") int userId) {
        // 调用Service获取数据
        DataVO dataVO = generalService.getTaskData(userId);
        // 用统一的ResultVO封装
        return ResultVO.success(dataVO);
    }

    /**
     * 跳转到生活资产页面
     *
     * @return 生活资产页面视图名称
     */
    @RequestMapping("/life-asset")
    public String lifeAsset() {
        return "life/life-asset";
    }

    /**
     * 跳转到待办管理页面
     *
     * @return 待办管理页面视图名称
     */
    @RequestMapping("/life-todo")
    public String lifeTodo() {
        return "life/life-todo";
    }
}
