```shell
yum install libaio autoconf -y
```

```shell
wget https://cdn.mysql.com/archives/mysql-5.6/mysql-5.6.37-linux-glibc2.12-x86_64.tar.gz
```

```shell
tar -zxvf mysql-5.6.37-linux-glibc2.12-x86_64.tar.gz
```

```shell
mv mysql-5.6.37-linux-glibc2.12-x86_64 /usr/local/mysql
```

```shell
mkdir -p /data/mysql3306
```

```shell
groupadd mysql
```

```shell
useradd -r -g mysql -s /bin/false mysql
```

```shell
chown -R mysql:mysql /data/mysql3306
```

```shell
vim /data/mysql3306/my3306.cnf
```

```tex
# The MySQL server
[mysqld]
user=mysql
port=3306
datadir=/data/mysql3306
tmpdir=/tmp
slave-load-tmpdir=/tmp
socket=/tmp/mysql3306.sock
join_buffer_size=2M
sort_buffer_size=4M
read_buffer_size=2M
read_rnd_buffer_size=2M
thread_cache_size=64
thread_concurrency=32
max_connect_errors=99999999
long_query_time=1
slow-query-log=1
slow-query-log-file=/data/mysql3306/show3306.log
back_log=600
myisam_repair_threads=1
myisam_recover_options=force,backup
expire_logs_days=10
interactive_timeout=3600
wait_timeout=3600
#old_passwords=1
skip-slave-start=1
skip-name-resolve
max_user_connections=2000
max_connections=3000
character-set-server=utf8
read_only=0
log-slave-updates=1
secure_file_priv=''
event_scheduler=1
innodb_checksum_algorithm=innodb
innodb_data_file_path=ibdata1:200M:autoextend
innodb_log_files_in_group=2
innodb_log_file_size=1048576000
innodb_page_size=16384
innodb_undo_directory=.
innodb_undo_tablespaces=0
master-info-repository=file
relay-log-info_repository=file
#------------- innodb --------------
innodb_buffer_pool_size=16G
innodb_additional_mem_pool_size=1M
innodb_flush_log_at_trx_commit=0
innodb_log_buffer_size=8M
innodb_max_dirty_pages_pct=90
innodb_lock_wait_timeout=20
innodb_file_per_table=1
innodb_flush_method=O_DIRECT
innodb_support_xa=0
innodb_io_capacity=500
innodb_buffer_pool_instances=10
server-id=890903306
log-bin=mysql-bin
relay-log=relay-bin
log-error=/data/mysql3306/error3306.log
[myisamchk]
key_buffer=64M
sort_buffer_size=32M
read_buffer=16M
write_buffer=16M
```

```shell
cd /usr/local/mysql/scripts
```

```shell
mysql_install_db --defaults-file=/data/mysql3306/my3306.cnf --basedir=/usr/local/mysql/ --datadir=/data/mysql3306/ --user=mysql
```

```shell
export PATH=/usr/local/mysql/bin:$PATH
```

```shell
mysqld_safe --defaults-file=/data/mysql3306/my3306.cnf &
```

```shell
mysql --socket=/tmp/mysql3306.sock –uroot –p
```

```shell
update user set password=password("123456") where user="root";
```

```shell
flush privileges;
```

```shell
create user 'test'@'%' identified by '123456';
```

```shell
grant all privileges on *.* to 'test'@'%' with grant option;
```

# mysql8

* 临时修改密码等级

```shell
set global validate_password.policy=0;
```

```shell
set global validate_password.length=6;
```

 * 创建用户

```shell
CREATE USER 'username'@'host' IDENTIFIED WITH mysql_native_password BY 'password';
```

* 授权

```shell
GRANT privileges ON `database`.`table` TO 'username'@'host' [WITH GRANT OPTION];
```

>privileges: SELECT, INSERT, UPDATE, DELETE, CREATE, DROP or ALL PRIVILEGES
>
>database.table: 
>
>WITH GRANT OPTION: 用户是否可以授权

```shell
GRANT ALL PRIVILEGES ON *.* TO 'username'@'host' WITH GRANT OPTION;
```

```shell
FLUSH PRIVILEGES;
```

```shell
SHOW GRANTS FOR 'username'@'host'
```

* 撤销权限

```shell
REVOKE privilege ON `database`.`table` FROM 'username'@'host';
```



* 修改密码

```shell
ALTER USER 'username'@'host' IDENTIFIED WITH mysql_native_password BY 'password';
```

* 删除用户

```shell
DROP USER 'username'@'host';
```

