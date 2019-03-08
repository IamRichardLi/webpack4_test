# nginx 配置
```
server {
        listen      80;
        server_name test.webpack4.cn;
        charset utf-8;
        location / {
            proxy_pass http://127.0.0.1:8087;
            error_page 405 =200 http://$host$request_uri;
            index index.html index.htm;
        }
    }
```

注意即使配置了nginx做代理，可能访问的时候，如访问test.webpack4.cn(预期是达到访问localhost:8087相同的效果)时，实际上是无法热更新的，需要到devServer中配置一个allowedHosts白名单，将这里的test.webpack4.cn添加到白名单中

# 运行
执行npm run dev 启动本地服务器
执行npm run build 进行生产环境的打包，会在根目录下生产dist/
