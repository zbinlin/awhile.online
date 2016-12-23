# awhile.online website

## 要求

* Node.js 6.8+ (包含 NPM）
* PostgreSQL
* Redis

## 准备

通过 `psql` 连接到 postgresql，然后输入以下命令创建用户和数据库：

```sql
CREATE USER awhile;
CREATE DATABASE awhile_online OWNER awhile;
CREATE TABLE IF NOT EXISTS awhile_users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    nickname VARCHAR(32),
    email VARCHAR(320),
    password CHAR(1024) NOT NULL,
    salt CHAR(256) NOT NULL
);
```

然后把代码 clone 下来：

```bash
git clone https://github.com/zbinlin/awhile.online
```

clone 下来后，进入 `awhile.online` 目录下，安装应用所需要的包：

```
cd awhile.online
npm install
```

现在假设你已经将 postgresql 和 redis 安装在本地上，并且已经启动了。

postgresql 的地址为 `localhost`，端口为 `5432`，根据上面执行的 sql，创建了用户

`awhile` 和数据库 `awhile_online`。

redis 的地址为 `localhost`，端口为 `6379`。

这时，可以以下命令 export 网站所需要的环境变量：

```bash
export PGHOST=localhost PGPORT=5432 PGUSER=awhile PGDATABASE=awhile_online
export REDIS_URL="redis://localhost:6379"
```

到了这里，所需要准备的工作已经完成了。

## 在本地运行

如果现在需要在本地运行，可以在上一节最后执行代码的那个 shell 上运行以下两条命令：

```bash
npm run build-client && npm run build-server
npm run serve
```

如果没有报错，可以看到最后会显示以下信息：

```
{ address: '127.0.0.1', family: 'IPv4', port: 8000 }
```

这时，就可以在浏览器里打开 `http://127.0.0.1:8000` 查看了。

**注：**如果运行 `npm run serve` 报 `8000` 端口被占用的，可以通过以下命令使用另一个端口运行：

```
PORT=8001 npm run serve
```

## 部署到服务器上

详情见 [Summary#部署](./summary.md)


>Copyright 2016 Colin Zheng
>
>This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, version.
>
>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
>
>You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
