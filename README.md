#说明
react和nodejs集成<br/>
这个项目是基于之前自己写的java跟react集成而来(https://github.com/Johnson-hd/maven_ssm)
#框架
前端:react+redux<br/>
后端:nodejs(主要组件:express(服务器),waterline(数据库使用),sails-mysql(sails将sails-mysql集成在waterline上,方便拓展不同的数据库))<br/>
数据库:redis+mysql<br/>
#执行
bower install(可以没有,已经放入了public/static文件中,方便下载)<br/>
npm install<br/>
npm run hot<br/>
npm run start<br/>
server start => localhost:7101<br/>
#主要功能
1.登录<br/>
2.注册<br/>
3.查询(列表查询,个人查询:支持模糊查询)<br/>
4.分页<br/>
5.后续会继续完善<br/>
#关键问题
自学的nodejs,写的这个项目,所以处处不会,觉得处处都是关键,不过nodejs很适合前端童鞋开发,同maven_ssm,还是指出express服务器拦截react router的处理方法吧<br/>
res.sendfile('public/index.html'),前端路由请求以*.page结尾,express服务器拦截此请求后分发到index.html处理,详见config/express.js
#项目截图
 ![image](https://github.com/Johnson-hd/mms/raw/master/public/static/images/project_1.png)<br/>
 ![image](https://github.com/Johnson-hd/mms/raw/master/public/static/images/project_2.png)<br/>
 ![image](https://github.com/Johnson-hd/mms/raw/master/public/static/images/project_3.png)<br/>
 ![image](https://github.com/Johnson-hd/mms/raw/master/public/static/images/project_4.png)<br/>










