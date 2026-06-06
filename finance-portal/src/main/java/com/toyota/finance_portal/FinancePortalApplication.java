package com.toyota.finance_portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.toyota.finance_portal", "com.toyota.finance"})
@EntityScan(basePackages = "com.toyota.finance.entity")
@EnableJpaRepositories(basePackages = "com.toyota.finance.repository")
public class FinancePortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinancePortalApplication.class, args);
	}

}
