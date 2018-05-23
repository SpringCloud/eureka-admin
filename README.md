![image](https://img.shields.io/circleci/project/github/RedSparr0w/node-csgo-parser.svg)
# Eureka Admin 管控平台
#### Eureka Admin 管控平台是Spring Cloud中国社区为Eureka注册中心开源的一个节点监控、服务动态启停的项目。
***
构建步骤：  
1、正常启动您的Eureka以及服务体系  
2、由于目前尚未提交中央仓库，需下载源码构建，打开eureka-admin-starter-server项目配置文件，设置您的eureka注册中心地址以及eureka-admin管控平台端口即可，如下，  
```
server:
  port: 8080
eureka:
  server: 
    eviction-interval-timer-in-ms: 30000
  client:
    register-with-eureka: false
    fetch-registry: true
    filterOnlyUpInstances: false
    serviceUrl:
       defaultZone: http://localhost:8888/eureka/
logging:
  level:
    com:
      itopener: DEBUG
    org:
      springframework: INFO
```
正常启动主类即可，浏览器访问：http://localhost:8080 ，效果如下，
    

![image](https://github.com/SpringCloud/eureka-admin/blob/master/eureka-admin-sample/eureka-admin-sample-eureka-server/img/Dashboard.png)
![image](https://github.com/SpringCloud/eureka-admin/blob/master/eureka-admin-sample/eureka-admin-sample-eureka-server/img/Admin.png)
