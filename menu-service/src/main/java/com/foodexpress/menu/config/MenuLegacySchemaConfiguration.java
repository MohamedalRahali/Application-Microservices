package com.foodexpress.menu.config;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Schéma hérité : {@code menu_items.category} NOT NULL sans JPA → INSERT refusé (MySQL 1364). Idempotent.
 */
@Configuration
public class MenuLegacySchemaConfiguration implements InitializingBean {

    private final DataSource dataSource;

    public MenuLegacySchemaConfiguration(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void afterPropertiesSet() {
        try (Connection c = dataSource.getConnection(); Statement st = c.createStatement()) {
            st.executeUpdate("ALTER TABLE menu_items MODIFY COLUMN category VARCHAR(255) NULL");
        } catch (SQLException ignored) {
            /* colonne absente, déjà nullable, ou non-MySQL */
        }
    }
}
