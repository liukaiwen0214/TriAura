package com.triauras;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LogTest {
    public static void main(String[] args) {
        log.info("这是一条info日志");
        log.error("这是一条error日志");
        log.debug("这是一条debug日志");
        log.trace("这是一条trace日志");
    }
}