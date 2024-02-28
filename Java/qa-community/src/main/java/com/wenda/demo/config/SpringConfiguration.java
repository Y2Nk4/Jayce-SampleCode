package com.wenda.demo.config;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class SpringConfiguration
        implements WebServerFactoryCustomizer<ConfigurableWebServerFactory> {
    @Autowired
    private final Environment environment;

    @Override
    public void customize(ConfigurableWebServerFactory factory) {
        int port = Integer.parseInt(environment.getProperty("SERVER_PORT", "8081"));
        factory.setPort(port);
    }
}
