package cn.springcloud.eureka;

import javax.annotation.Resource;

import org.springframework.cloud.client.serviceregistry.ServiceRegistry;
import org.springframework.cloud.netflix.eureka.serviceregistry.EurekaRegistration;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.netflix.appinfo.InstanceInfo;
import com.netflix.appinfo.InstanceInfo.InstanceStatus;
import com.netflix.discovery.EurekaClient;
import com.netflix.discovery.shared.Application;

@RestController
@RequestMapping("eureka-admin-client")
public class ServiceRegistryController {

	@Resource
	private ServiceRegistry<EurekaRegistration> serviceRegistry;
	
	@Resource
	private EurekaRegistration registration;
	
	@Resource
	private EurekaClient eurekaClient;
	
	@RequestMapping(value = "status", method = RequestMethod.GET)
	public ResultMap getStatus(){
		return ResultMap.buildSuccess().put("status", serviceRegistry.getStatus(registration));
	}
	
	@RequestMapping(value = "status", method = RequestMethod.POST)
	public ResultMap setStatus(String status){
		serviceRegistry.setStatus(registration, status);
		return ResultMap.buildSuccess();
	}
	
	@RequestMapping(value = "status/{appName}", method = RequestMethod.POST)
	public ResultMap status(@PathVariable String appName, String instanceId, String status){
		Application application = eurekaClient.getApplication(appName);
		InstanceInfo instanceInfo = application.getByInstanceId(instanceId);
		instanceInfo.setStatus(InstanceStatus.toEnum(status));
		return ResultMap.buildSuccess();
	}
	
}
