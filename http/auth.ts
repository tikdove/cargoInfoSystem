/*
 * @Author: Mr.He 
 * @Date: 2018-03-21 22:52:23 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2018-04-01 11:39:46
 * @content what is the content of this file. */

import register from "api/auth/register";
import login from "api/auth/login";
import Router = require("koa-router");

let router = new Router();

router.post("/auth/register", async (ctx, next) => {
    let result;
    result = await register.register(ctx.request.body);
    ctx.response.body = result;
});

router.post("/auth/login", async (ctx, next) => {
    ctx.response.body = await login.login(ctx.request.body);
});


import { TypesRouter } from "./types";
import { CustomerRouter } from "./customer";
TypesRouter(router);
CustomerRouter(router);

export default router;
