package com.triauras.service.impl;

import com.triauras.entity.Users;
import com.triauras.mapper.UsersMapper;
import com.triauras.util.PasswordUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UsersMapper usersMapper;

    @InjectMocks
    private UserServiceImpl userService;

    private Users testUser;

    @BeforeEach
    void setUp() {
        // 初始化测试数据
        testUser = new Users();
        testUser.setUsername("liukaiwen");
        testUser.setEmail("lkwyouxiang@126.com");
        testUser.setPassword_hash(PasswordUtil.encode("123456"));
        testUser.setAvatar_url("https://example.com/avatar.jpg");
        testUser.setTimezone("Asia/Shanghai");
        testUser.setCurrency("CNY");
        testUser.setIs_active(true);
    }

    @Test
    void testInsertUser_Success() {
        // 配置mock行为 - 用户名和邮箱都不存在
        when(usersMapper.getUserByEmail(testUser.getUsername())).thenReturn(null);
        when(usersMapper.getUserByEmail(testUser.getEmail())).thenReturn(null);
        when(usersMapper.insertUser(testUser)).thenReturn(1); // 插入成功，返回1行

        // 执行测试
        boolean result = userService.insertUser(testUser);

        // 验证结果
        assertTrue(result);
        verify(usersMapper).getUserByEmail(testUser.getUsername());
        verify(usersMapper).getUserByEmail(testUser.getEmail());
        verify(usersMapper).insertUser(testUser);

        // 验证默认值是否被设置
        assertNotNull(testUser.getCreated_at());
        assertNotNull(testUser.getUpdated_at());
    }

    @Test
    void testInsertUser_UsernameExists() {
        // 配置mock行为 - 用户名已存在
        when(usersMapper.getUserByEmail(testUser.getUsername())).thenReturn(new Users());

        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.insertUser(testUser);
        });

        // 验证异常信息
        assertTrue(exception.getMessage().contains("用户名已存在"));
        verify(usersMapper).getUserByEmail(testUser.getUsername());
        verify(usersMapper, never()).getUserByEmail(testUser.getEmail());
        verify(usersMapper, never()).insertUser(testUser);
    }

    @Test
    void testInsertUser_EmailExists() {
        // 配置mock行为 - 邮箱已存在
        when(usersMapper.getUserByEmail(testUser.getUsername())).thenReturn(null);
        when(usersMapper.getUserByEmail(testUser.getEmail())).thenReturn(new Users());

        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.insertUser(testUser);
        });

        // 验证异常信息
        assertTrue(exception.getMessage().contains("邮箱已被注册"));
        verify(usersMapper).getUserByEmail(testUser.getUsername());
        verify(usersMapper).getUserByEmail(testUser.getEmail());
        verify(usersMapper, never()).insertUser(testUser);
    }

    @Test
    void testUpdatePassword_Success() {
        // 准备测试数据
        String username = "liukaiwen";
        String currentPassword = "123456";
        String newPassword = "My148632";
        String currentPasswordHash = PasswordUtil.encode(currentPassword);

        // 配置mock行为
        Users user = new Users();
        user.setPassword_hash(currentPasswordHash);
        when(usersMapper.getUserByUsername(username, currentPasswordHash)).thenReturn(user);
        when(usersMapper.updatePassword(username, currentPasswordHash, anyString())).thenReturn(1);

        // 执行测试
        boolean result = userService.updatePassword(username, currentPassword, newPassword);

        // 验证结果
        assertTrue(result);
        verify(usersMapper).getUserByUsername(username, currentPasswordHash);
        verify(usersMapper).updatePassword(username, currentPasswordHash, anyString());
    }

    @Test
    void testUpdatePassword_WrongCurrentPassword() {
        // 准备测试数据
        String username = "liukaiwen";
        String wrongPassword = "wrongPass";
        String newPassword = "My148632";

        // 配置mock行为
        when(usersMapper.getUserByUsername(username, wrongPassword)).thenReturn(null);

        // 执行测试
        boolean result = userService.updatePassword(username, wrongPassword, newPassword);

        // 验证结果
        assertFalse(result);
        verify(usersMapper).getUserByUsername(username, wrongPassword);
        verify(usersMapper, never()).updatePassword(anyString(), anyString(), anyString());
    }

    @Test
    void testGetUserByUsername() {
        // 准备测试数据
        String username = "liukaiwen";
        String passwordHash = PasswordUtil.encode("123456");
        Users expectedUser = new Users();

        // 配置mock行为
        when(usersMapper.getUserByUsername(username, passwordHash)).thenReturn(expectedUser);

        // 执行测试
        Users actualUser = userService.getUserByUsername(username, passwordHash);

        // 验证结果
        assertEquals(expectedUser, actualUser);
        verify(usersMapper).getUserByUsername(username, passwordHash);
    }
}