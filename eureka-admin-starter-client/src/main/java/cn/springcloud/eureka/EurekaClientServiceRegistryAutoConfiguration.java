package cn.springcloud.eureka;

import javax.imageio.spi.ServiceRegistry;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.cloud.netflix.eureka.serviceregistry.EurekaRegistration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EurekaClientServiceRegistryAutoConfiguration {

	@Bean
	@ConditionalOnBean({ServiceRegistry.class, EurekaRegistration.class})
	public ServiceRegistryController serviceRegistryController(){
		return new ServiceRegistryController();
	}
}
