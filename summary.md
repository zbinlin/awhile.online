# https://awhile.online 开发过程总结

## 需求分析

网站的功能是可以由用户发布临时性的消息，消息的有效期可以自由定制，过期后自动删除，消息发布成功后自动生成一条链接用于查看该消息。

* 注册/登录/登出
* 发布消息
* 显示消息
* 消息必须加密存储
* 发布消息时可以指定一个时间段
* 过期的消息自动失效（删除）
* 注册用户可以删除自己发布的消息


## 技术选型

网站最主要的功能是发布消息，但这个消息不是永久保存了，而且保存的时间不会太长，预计消息的长度也不会太长，因此使用 redis 来存储是比较合适。

由于对后端数据库这一块还不太熟悉，目前也就对 PostgreSQL 用得多点，因此在存储用户的注册信息这一块就选择了 PostgreSQL。

登录这一块打算使用 JWT 来做，因此无需保存用户状态到 PostgreSQL 数据库中，这样可以减少对数据库的操作。

后端选用 Node.js + koa + koa-router，另外由于现在 async/await 已经正式进入 ES2017 了，就打算使用 async/await 优化异步代码的结构。

前端准备做成单页应用，于是选用 preact + redux + redux-thunk。

前端的代码通过 webpack 打包，而后端的代码通过 rollup 打包（选用 rollup 打包是由于 Node.js 6+ 已经基本支持 ES2015 了，这里只需要将各个模块打包在一起，顺便把 async/await 转换成 Node.js 可以运行的代码就可以了，而这个工作非常合适 rollup 来做）。


## 核心库开发

在需求分析里，需要对消息进行加密处理，并且消息只在一段时间内有效，那可以将这段时间映射成一个值，然后使用这个值作为密码对消息进行加密，这样在这时间段之外的时间由于映射出来的值与该值不同，在对消息进行解密时会解密失败。这样就可以实现对消息加密、过期消息自动失效这两个需求了。

加密解密消息和将时间段映射成一个值的功能已经独立出来放到 [NPM](https://www.npmjs.com/package/muyun) 上了。


## 后端开发

后端数据库由于使用了 PostgreSQL，因此在 Node.js 中使用 `pg` 包来连接它。 另外使用 `redis` 包来连接 redis。

在使用 `pg` 包时，需要注意的一点是不要直接使用 pg.Client 来创建一个 Client 实例，而是通过 pg.Pool 创建一个连接池，通过连接池自动管理 Client 实例，这样一来可以避免手动管理 Client 实例的麻烦，还可以使 Client 实例重复利用，提高处理速度，最重要是的 pg.Pool 的实例支持 Promise，这样可以愉快地使用 async/await。

而使用 `redis` 包就没那么好运了，它日前只支持 callback 方式，要想支持 Promise，需要使用一些 Promise 库来进行 wrap 才行，还好之前我已经开发了一个类似的库（`promise-adapter`），只需要简单几段代码封装下就可以支持 Promise。

在使用 jwt 作为用户的登录状态管理时，刚开始的时候使用从环境变量 JWT_SECRET 传进来的值作为 jwt 的 secret，当使用登录时，如果验证用户登录成功后，就使用 jwt 生成一个 token 返回客户端，以后涉及到需要用户登录的操作都使用这个 token 作为用户登录凭证，在验证这个 token 的时候，也只是验证 token 是否合法。由于服务器端不保存任何的登录状态，当 secret 漏泄时，攻击者就可以通过这个 secret 来生成任意用户的合法的  token，这无疑是非常危险的。

后来就放弃了使用 JWT_SECRET 作为 secret，而改用随机生成 secret。当用户登录成功后，随机生成一个 key 和 secret，将 key 设置到 jwt payload 的 jti 中，然后使用 secret 为这个 payload 签名生成 token 返回给客户端，同时将 key 和 secret 保存到 redis 中。以后验证 token 的时候，根据 token 中的 jti 去 redis 里取出 secret，再来验证 token 是否合法就可以。

这里同时生成 key 和 secret 可以使用户在多个客户端同时登录，如果只想同一时间只能在一个客户端登录，可以使用用户名作为 key 来保存 secret 到 redis 中。


## 前端开发

前端一开始的时候，是不准备用 preact 的，因为觉得网站功能不多，并且非常简单。但后来深入分析了下，发现有些地方用纯原生的 js 写起来有些麻烦，而用 react 写起来就非常简单的。为了加快开发速度，只能选择 react 了，但 react 打包后的体积还是偏大，对于一个非常简单的网站使用，觉得有点不合适。这时，另一个 react 替代者 preact 进行了的我选择名单中，根据 preact 的 README 介绍，仅有 3kb 大小，虽然对此表示存疑，但这也说明了它确实是一个轻量级的 react 替代者。

通过简单的了解，发现 API 与 react 差异不太大，至少还可以接受，但在测试的时候有个坑。由于测试工具使用 jest，而 jest 对 preact 的支持不太好，无奈只有在测试的时间使用 react，而在正式环境中使用 preact，写 react 组件的时候尽量选择两者兼容的功能来使用。

有同学可能有疑问，代码里引入的是 `preact` 包，如何在测试中使用 `react` 包呢？这就多亏了 babel 的帮助，我只需要写一个 babel plugin，在测试的环境里将 preact 改成 react 就可以了，对这个 plugin 感兴趣的同学可以到 `tools/babel-plugin-preact-to-react.js` 查看。


## 部署

由于 VPS 上使用 centos7，已经使用 systemd 作为系统和服务的管理器了，因此打算直接使用 systemd 来管理 Node.js 应用。

既然使用 systemd 来管理，那就需要编写 systemd service 文件了，但在编写之前，需要先把 postgresql 和 redis 安装到服务器上。

postgresql 的安装由于之前写过的[博文](https://blog.mozcp.com/install-centos7-on-kvm/)里介绍了，这里就不展开了，这里说下 redis 的安装。

由于 centos7 上直接可用的 redis 包的版本已经低，这里直接在 redis 下载原代码来编译。编译的过程比较简单，将下载好的源码压缩包解压到指定的目录里，然后进入该目录执行 `make` 就可以编译了。如果在编译过程中报错，可能是编译所需要的工具未安装，这里比较省事的方法，可以通过 `yum groupinstall "development tools"` 将一些编译所需要的开发工具装上。

编译完成后，可以运行 `make install` 将 redis 安装到 `/usr/local/bin` 下面，上面说过了，使用 systemd 来管理服务，而 redis 默认没有 systemd 的服务文件，因此需要为 redis 编写一个服务文件，这里我使用 Arch 里 redis 的服务文件修改下直接用：

```
[Unit]
Description=Advanced key-value store
After=network.target

[Service]
Type=simple
User=redis
Group=redis
ExecStart=/usr/bin/local/redis-server /etc/redis.conf
ExecStop=/usr/bin/local/redis-cli shutdown
CapabilityBoundingSet=
PrivateTmp=true
PrivateDevices=true
ProtectSystem=full
ProtectHome=true
NoNewPrivileges=true
RuntimeDirectory=redis
RuntimeDirectoryMode=755
LimitNOFILE=10032

[Install]
WantedBy=multi-user.target
```

将上面的内容保存到 `/etc/systemd/system/redis.service` 中。

从上面的内容可以知道，还需要为 redis 准备一个用户（及用户组），以及将配置文件 redis.conf 复制到 `/etc/` 目录下。

为 redis 创建用户，可以使用以下命令：

```bash
useradd -d /var/lib/redis -m -s /bin/false -U redis
```

然后编辑 redis 源码目录下 `redis.conf` 配置文件，将 `dir` 的值修改成 `/var/lib/redis` ：

```
dir /var/lib/redis
```

保存好后，将其复制到 `/etc/` 目录下。

到此，redis 的配置已经算完成了，然后可以使用 `systemctl enable redis.service` 开启开机自动自动，使用 `systemctl start redis.service` 启动 redis，同时可以使用 `systemctl status redis.service` 查看启动是否正常。


前面 postgresql 和 redis 已经配置好了，是时候为 awhile.online 配置 systemd 服务文件了。awhile.online 的 systemd 服务文件与 redis 的类似：

```ini
[Unit]
Description=Awhile.online - a node.js App
Requires=rh-postgresql95-postgresql.service
Requires=redis.service
After=rh-postgresql95-postgresql.service redis.service

[Service]
Type=simple
User=awhile
Group=awhile
ExecStart=
ExecStart=/usr/bin/node /srv/awhile.online/www/index.js
ExecReload=/usr/bin/kill -HUP $MAINPID
Restart=on-failure
WorkingDirectory=/srv/awhile.online/www
EnvironmentFile=/home/awhile/env.txt

[Install]
WantedBy=multi-user.target
```

将上面的内容保存到 `/etc/systemd/system/awhile.online.service` 中。

这里需要为 awhile.online 也单独创建一个用户 `awhile` 来运行：

```
useradd -m -U awhile
```

创建成功后，切换到 `awhile` 用户（`su - awhile`，如果提示需要密码，先使用 `passwd awhile` 设置密码），将以下内容保存到 `~/env.txt` 下：

```
NODE_ENV = production
NODE_ASSETS_PATH = public

HOST = localhost
PORT = 6380

PGHOST = localhost
PGPORT = 5432
PGUSER = awhile
PGDATABASE = awhile_online

REDIS_URL = redis://localhost:6379
```

由于将 awhile.online 项目放到 `/srv/awhile.online/www` 目录下，因此需要创建该目录：

```
mkdir -p /srv/awhile.online
chown awhile:awhile /srv/awhile.online
mkdir -p /srv/awhile.online/www
```

目录创建好后，现在就需要通过 rsync + ssh 将本地的 awhile.online 项目上传到服务器，但上传之前最好为 服务器上的 `awhile` 用户创建一个 ssh 非对称密钥用于 ssh 登录。

在本地运行 `ssh-keygen` 生成密钥：

```
ssh-keygen -t ed25519 -f ~/.ssh/awhile.online
```

然后将公钥内容复制到服务器的 `awhile` 用户的 `.ssh/authorized_keys` 文件内：

```
ssh-copy-id -i ~/.ssh/awhile.online.pub awhile@<你的服务器地址>
```

现在可以使用 rsync 来上传 awhile.online 项目了，切换到本地的 awhile.online 项目目录下，先对项目进行 build：

```
npm run build
```

然后使用 rsync 同步到服务器的 `/srv/awhile.online/www` 目录下：

```
rsync -crlptHP --exclude "/node_modules/" --delete dist/ awhile@<REMOTE_HOST>:/srv/awhile.online/www
```

现在再次登录服务器来开启 `awhile.online.service`，登录到服务器后，由于 `systemctl` 命令需要特权用户才可以执行开启、启动等动作，而使用 su 切换到 root 用户不仅不安全，而且每次更新都需要登录服务器显得很麻烦，因此这里为 `awhile` 提供一种比较安全便捷的方式管理 `awhile.online.service` 服务。

首先使用命令 `visudo -f /etc/sudoers.d/awhile_online` 来创建编辑新的文件 `/etc/sudoers.d/awhile_online`。

将以下内容复制到该文件中保存：

```
awhile ALL=(root) NOPASSWD: /usr/bin/systemctl status awhile.online.service, /bin/systemctl start awhile.online.service, /usr/bin/systemctl stop awhile.online.service, /usr/bin/systemctl reload awhile.online.service, /usr/bin/systemctl restart awhile.online.service, /usr/bin/systemctl reload-or-restart awhile.online.service
```

上面内容的意思是用户名为 awhile，授权使用 root 用户，无需密码地运行后面的 /usr/bin/systemctl status awhile.online.service 等命令。

这样就既不用切换到 root 用户，也无需为 sudo 输入密码，就可以管理了。

保存成功后，可以使用 `sudo -llU awhile` 命令查看是否生效了，运行命令后会显示以下信息：

```
Matching Defaults entries for awhile on this host:
    requiretty, !visiblepw, always_set_home, env_reset, env_keep="COLORS
    DISPLAY HOSTNAME HISTSIZE INPUTRC KDEDIR LS_COLORS", env_keep+="MAIL PS1
    PS2 QTDIR USERNAME LANG LC_ADDRESS LC_CTYPE", env_keep+="LC_COLLATE
    LC_IDENTIFICATION LC_MEASUREMENT LC_MESSAGES", env_keep+="LC_MONETARY
    LC_NAME LC_NUMERIC LC_PAPER LC_TELEPHONE", env_keep+="LC_TIME LC_ALL
    LANGUAGE LINGUAS _XKB_CHARSET XAUTHORITY",
    secure_path=/sbin\:/bin\:/usr/sbin\:/usr/bin

User awhile may run the following commands on this host:

Sudoers entry:
    RunAsUsers: root
    Commands:
        NOPASSWD: /usr/bin/systemctl status awhile.online.service
    RunAsUsers: root
    Commands:
        /usr/bin/systemctl start awhile.online.service
    RunAsUsers: root
    Commands:
        /usr/bin/systemctl stop awhile.online.service
    RunAsUsers: root
    Commands:
        /usr/bin/systemctl reload awhile.online.service
    RunAsUsers: root
    Commands:
        /usr/bin/systemctl restart awhile.online.service
    RunAsUsers: root
    Commands:
        /usr/bin/systemctl reload-or-restart awhile.online.service
```

通过 Sudoers entry: 列出的命令，已经可以看到已经生效了。可能有同学会有疑问，为什么只有第一个命令有 `NOPASSWD`，其他的命令没有，是不是需要每个命令前面都需要添加 `NOPASSWD`？这里就不需要了，因为 `NOPASSWD` 是可以继承的，也就是说只需要第一个命令前面加上了，后面的也继承下来，除非后面命令的前面加上 `PASSWD` 覆盖了 `NOPASSWD`。

现在已经可以在 awhile 用户下，使用 `sudo systemctl start awhile.online.service` 等命令来操作 awhile.online.service 了，但是还不能在本地使用 ssh 直接运行上述命令。重新看下上面的 `sudo -llU awhile` 显示的信息里，可以看到 `Matching Default` 下面的第一个是 `requiretty`，如果你现在通过 ssh 运行，比如：

```
ssh <REMOTE_HOST> sudo systemctl restart awhile.online.service
```

就会提示

```
sudo: sorry, you must have a tty to run sudo
```

这是由于 ssh 默认没有开 tty，而上面的 `requiretty` 是需要 tty 来运行 sudo 命令的，因此会报错。

解决的方法有两个，一是给 ssh 添加 `-t` 参数，该参数可以在连接时开启 tty。

另一个方法是编辑 `/etc/sudoers.d/awhile_online` 文件（同样使用上面的 `visudo -f /etc/sudoers.d/awhile_online` 命令来编辑），添加以下内容：

```
Defaults:awhile !requiretty
```

来关闭 awhile 用户的 requiretty 选项。

保存后，重新运行 `sudo -llU awhile` 会后台 Mathing Default 下面一行的最后那里添加了 `!requiretty`。

至此，整个部署工作算完成了，以后可以通过 rsync 同步更新版本，然后通过 `ssh awhile@<REMOTE_HOST> sudo reload awhile.online.service` 或 `ssh awhile@<REMOTE_HOST> sudo restart awhile.online.service` 来应用更新了（这里如果仅更新 awhile.online 的浏览器端资源，可以使用 reload，如果需要更新 awhile.online 的 Node.js 端的，需要使用 restart）。
