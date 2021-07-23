# Spring Boot环境中发送邮件

## pom.xml引入`spring-boot-starter-mail`

Spring Boot2.x集成了mail模块，在`dependencies`引入这个

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

## application.yml配置

```
spring:
	mail:
    	# 163
    	host: smtp.163.com
    	port:
    	username: yimcarson@163.com
    	password: ************
    	protocol: smtp
    	default-encoding: UTF-8
    	properties:
      		mail.smtp.auth: true
      		mail.smtp.starttls.enable: true
      		mail.smtp.starttls.required: true
      		mail.smtp.socketFactory.port: 465
      		mail.smtp.socketFactory.class: javax.net.ssl.SSLSocketFactory
      		mail.smtp.socketFactory.fallback: false
```

其中`spring.mail.host` `spring.mail.port` `spring.mail.username` `spring.mail.password`不同邮箱的配置方法也不同

## 163邮箱

```
spring:
	mail:
    		host: smtp.163.com
    		port:
    		username: yimcarson@163.com
    		password: ************
```

其中`spring.mail.port`不指定；`spring.mail.password`不是邮箱密码，需要登录`mail.163.com`，前往`设置` `客户端授权密码`中获取的一个16个字符的密码，同时允许POP3/SMTP服务。

![163邮箱设置1](https://img-blog.csdnimg.cn/20181210101910671.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3lpbWNhcnNvbg==,size_16,color_FFFFFF,t_70)

![163邮箱设置2](https://img-blog.csdnimg.cn/20181210102018898.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3lpbWNhcnNvbg==,size_16,color_FFFFFF,t_70)

## QQ邮箱

```
spring:
	mail:
    		host: smtp.qq.com
    		port: 587
    		username: yimcarson@qq.com
    		password: ************
```

`spring.mail.password`不是QQ密码，登录`mail.qq.com`，前往`设置` `账户` `POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务`开启`POP3/SMTP服务`获取一个16个字符的密码

![mail.163.com设置](https://img-blog.csdnimg.cn/20181210101244184.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3lpbWNhcnNvbg==,size_16,color_FFFFFF,t_70)

## Gmail邮箱

```
spring:
	mail: 
		host: smtp.gmail.com
		port: 465
		username: yimcarson@gmail.com
		password: ****************
```

`spring.mail.password`是Gmail的密码，但是要前往Google账户的[安全性较低的应用的访问权限](https://myaccount.google.com/lesssecureapps)中允许不安全应用。

![Google账户设置](https://img-blog.csdnimg.cn/2018121010143628.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3lpbWNhcnNvbg==,size_16,color_FFFFFF,t_70)

# 发送邮件

这是一个验证码模版邮件

### service实现类

```java
import com.my.demo.project.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;
import java.util.UUID;

@Service
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * 用来发送模版邮件
     */
    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String from;

    @Override
    public void send(String to, String subject, String text) {

//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom(from);
//        message.setTo(to);
//        message.setSubject(subject);
//        message.setText(text);

        Context context = new Context();
        context.setVariable("project", "demo");
        context.setVariable("author", "yimcarson");
        context.setVariable("code", text);
        String emailContent = templateEngine.process("mail", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = null;
        try {
            helper = new MimeMessageHelper(message, true);
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(emailContent, true);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        mailSender.send(message);
    }
}
```

## templates模版

```xml
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
	<head>
	    <meta charset="UTF-8">
	    <title>yimcarson</title>
	    <style>
	        body {
	            text-align: center;
	            margin-left: auto;
	            margin-right: auto;
	        }
	        #main {
	            text-align: center;
	            position: absolute;
	        }
	    </style>
	</head>
	<body>
		<div id="main">
	    	<h3>Welcome <span th:text="${project}"></span> -By <span th:text=" ${author}"></span></h3>
	    	Your Verification Code is
	    	<h2><span th:text="${code}"></span></h2>
		</div>
	</body>
</html>
```

## 测试

```java
import com.my.demo.Application;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.thymeleaf.TemplateEngine;

import java.util.Date;
import java.util.UUID;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {Application.class})
public class MailServiceTest {
    @Autowired
    private MailService mailService;

    @Test
    public void testSend() {
    	String to = "yimcarson@qq.com";
		mailService.send(to, "模板邮件", UUID.randomUUID().toString().toUpperCase());
    }
}
```

![接收到的模版邮件](https://img-blog.csdnimg.cn/20181210103736543.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3lpbWNhcnNvbg==,size_16,color_FFFFFF,t_70)

## 结语

`163` `QQ`这两个邮箱比较常用，至于`Gmail`……，如果服务器是阿里云香港或者国外、亚马逊这些的话可以正常使用，否则……，`Couldn't connect to host, port: smtp.gmail.com, 465; timeout -1`

![Couldn't connect to host, port: smtp.gmail.com, 465; timeout -1](https://img-blog.csdnimg.cn/20181210104709323.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3lpbWNhcnNvbg==,size_16,color_FFFFFF,t_70)