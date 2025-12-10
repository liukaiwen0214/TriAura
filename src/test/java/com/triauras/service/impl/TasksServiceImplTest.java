package com.triauras.service.impl;

import com.triauras.entity.Tasks;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Map;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(locations = {"classpath:/config/applicationContext.xml", "classpath:/config/springmvc-servlet.xml"})
class TasksServiceImplTest {
    @Autowired
    private TasksServiceImpl tasksServiceImpl;

    @Test
    void getToDoListIsDeleted() {
        List<Tasks> tasks = tasksServiceImpl.getToDoList(1);
        for (Tasks task : tasks) {
            System.out.println(task);
        }
        Assertions.assertNotNull(tasks);
    }

    @Test
    void getToDoListStatistics() {
        Map<String, Integer> tasks = tasksServiceImpl.getToDoListStatistics(1);
        System.out.println(tasks);
        Assertions.assertNotNull(tasks);
    }
}