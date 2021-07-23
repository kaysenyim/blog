# CentOS Nginx部署文档

```shell
yum install -y pcre-devel openssl-devel gcc-c++
```

```shell
wget http://nginx.org/download/nginx-1.14.0.tar.gz
```

```shell
tar -zxvf nginx-1.14.0.tar.gz
```

```shell
cd nginx-1.14.0
```

```shell
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
```

```shell
make && make install
```

```shell
ln -s /usr/local/nginx/sbin/nginx /usr/local/bin/
```
