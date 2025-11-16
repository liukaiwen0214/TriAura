package com.triauras.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

public class VerifyCodeGenerator {
    // 字符库：数字 + 大小写字母（显示多样化）
    private static final String CHAR_POOL = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    // 安全字符库（去除易混淆字符）
    private static final String SAFE_CHAR_POOL = "23456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
    private static final Random RANDOM = new Random();
    private static final int DEFAULT_LENGTH = 6;
    // 验证码有效期：5分钟（单位：毫秒）
    private static final long EXPIRATION_MILLIS = TimeUnit.MINUTES.toMillis(5);
    // 存储验证码：key=验证码内容，value=生成时间戳（毫秒）
    private static final Map<String, Long> CAPTCHA_STORAGE = new HashMap<>();

    /**
     * 生成带有效期的6位安全验证码（5分钟内有效）
     *
     * @return 生成的验证码（含大小写字母和数字）
     */
    public static String generateTimedCaptcha() {
        return generateCaptcha(DEFAULT_LENGTH, true);
    }

    /**
     * 生成指定长度的验证码并记录生成时间
     *
     * @param length      长度
     * @param useSafeMode 是否启用安全模式
     * @return 验证码
     */
    public static String generateCaptcha(int length, boolean useSafeMode) {
        if (length <= 0) {
            length = DEFAULT_LENGTH;
        }
        String charPool = useSafeMode ? SAFE_CHAR_POOL : CHAR_POOL;
        StringBuilder captcha = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = RANDOM.nextInt(charPool.length());
            captcha.append(charPool.charAt(index));
        }
        String captchaStr = captcha.toString();
        // 记录生成时间（当前毫秒时间戳）
        CAPTCHA_STORAGE.put(captchaStr, System.currentTimeMillis());
        return captchaStr;
    }

    /**
     * 验证验证码（检查有效性和时效性）
     *
     * @param userInput        用户输入的验证码
     * @param generatedCaptcha 系统生成的验证码
     * @return 验证是否通过（内容匹配且在有效期内）
     */
    public static boolean validateCaptcha(String userInput, String generatedCaptcha) {
        // 1. 基础非空校验
        if (userInput == null || generatedCaptcha == null) {
            return false;
        }
        // 2. 大小写不敏感校验
        boolean contentMatch = userInput.trim().equalsIgnoreCase(generatedCaptcha.trim());
        if (!contentMatch) {
            return false;
        }
        // 3. 时效性校验（5分钟内有效）
        Long generateTime = CAPTCHA_STORAGE.get(generatedCaptcha);
        if (generateTime == null) {
            return false; // 验证码未记录（可能已被清理）
        }
        long currentTime = System.currentTimeMillis();
        boolean isWithinValidTime = (currentTime - generateTime) <= EXPIRATION_MILLIS;

        // 4. 验证通过后移除（防止重复使用）
        if (isWithinValidTime) {
            CAPTCHA_STORAGE.remove(generatedCaptcha);
        }
        return isWithinValidTime;
    }

    /**
     * 定期清理过期验证码（可在项目启动时调用，定时执行）
     */
    public static void cleanExpiredCaptchas() {
        long currentTime = System.currentTimeMillis();
        CAPTCHA_STORAGE.entrySet().removeIf(
                entry -> (currentTime - entry.getValue()) > EXPIRATION_MILLIS
        );
    }

    // 测试示例
    public static void main(String[] args) throws InterruptedException {
        // 生成验证码
        String captcha = generateTimedCaptcha();
        System.out.println("生成的验证码：" + captcha + "（5分钟内有效）");

        // 模拟用户输入正确且在有效期内（验证通过）
        String userInput = "a3B7d9"; // 假设生成的验证码是"A3b7D9"
        System.out.println("第一次验证（有效）：" + validateCaptcha(userInput, captcha)); // true

        // 模拟重复使用（已被移除，验证失败）
        System.out.println("第二次验证（重复使用）：" + validateCaptcha(userInput, captcha)); // false

        // 模拟过期场景（等待6分钟后验证）
        String expiredCaptcha = generateTimedCaptcha();
        System.out.println("生成过期测试验证码：" + expiredCaptcha);
        System.out.println("等待6分钟...");
        TimeUnit.MINUTES.sleep(6); // 等待6分钟（超过有效期）
        System.out.println("过期后验证：" + validateCaptcha(expiredCaptcha, expiredCaptcha)); // false
    }
}
