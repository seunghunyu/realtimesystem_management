package com.realtime.management.config;

import jakarta.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties; // 💡 패키지 위치 확인
import org.springframework.boot.hibernate.autoconfigure.HibernateProperties;
import org.springframework.boot.hibernate.autoconfigure.HibernateSettings;
import org.springframework.boot.jdbc.DataSourceBuilder; // 💡 빌더를 직접 사용합니다.

import org.springframework.boot.jpa.EntityManagerFactoryBuilder;
import org.springframework.boot.jpa.autoconfigure.JpaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.Map;

public class MariaDataSourceConfig {

    // 💡 application.yml에서 값을 직접 주입받습니다.
    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${spring.datasource.driver-class-name}")
    private String dbDriverClassName;

    private final JpaProperties jpaProperties;
    private final HibernateProperties hibernateProperties;

    public MariaDataSourceConfig(JpaProperties jpaProperties, HibernateProperties hibernateProperties) {
        this.jpaProperties = jpaProperties;
        this.hibernateProperties = hibernateProperties;
    }

    // 💡 @ConfigurationProperties를 제거하고 빌더에 직접 변수를 매핑하여 jdbcUrl 누락 에러를 방지합니다.
    @Bean(name = "mariaDataSource")
    @Primary
    public DataSource mariaDataSource() {
        return DataSourceBuilder.create()
                .url(dbUrl)
                .username(dbUsername)
                .password(dbPassword)
                .driverClassName(dbDriverClassName)
                .build();
    }

    @Bean(name = "mariaEntityManagerFactory")
    @Primary
    public LocalContainerEntityManagerFactoryBean mariaEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("mariaDataSource") DataSource dataSource) {

        Map<String, Object> properties = hibernateProperties.determineHibernateProperties(
                jpaProperties.getProperties(),
                new HibernateSettings()
        );

        return builder
                .dataSource(dataSource)
                .packages("com.realtime.management.entity")
                .persistenceUnit("maria")
                .properties(properties)
                .build();
    }

    @Bean(name = "mariaTransactionManager")
    @Primary
    public PlatformTransactionManager mariaTransactionManager(
            @Qualifier("mariaEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}