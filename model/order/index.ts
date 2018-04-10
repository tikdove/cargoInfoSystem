/*
 * @Author: Mr.He 
 * @Date: 2018-04-01 17:48:06 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2018-04-06 23:40:53
 * @content what is the content of this file. */


import { DB } from "common/db";
import uuid = require("uuid");
import { Model } from "sequelize";
import { Context } from 'koa';
import * as moment from 'moment';
import { UserInfo } from 'model/interface';
import { getNamespace } from "continuation-local-storage";

export class Order {
    model: Model<any, any>;
    constructor(model: Model<any, any>) {
        this.model = model;
    }

    async get(ctx: Context) {
        let { id } = ctx.params;
        let companyId = ctx.state.users.company.id;
        return await this.model.findOne({
            where: {
                id,
                companyId,
                deletedAt: null
            }
        });
    }

    async find(ctx: Context) {
        let companyId = ctx.state.users.company.id;
        let { page = 0 } = ctx.request.query;
        let limit = 20; //不允许接收外面转入值
        return await this.model.findAndCountAll({
            where: {
                companyId,
                deletedAt: null
            },
            order: [["created_at", "desc"]],
            offset: page * limit,
            limit
        });
    }

    async post(params: { customerId: string; total: number }) {
        let userInfo = getNamespace("session").get("session");
        let { customerId, total } = params;
        if (!total || !customerId) {
            throw new Error("order add, total total and customerId need.");
        }
        let companyId = userInfo.company.id;
        let operaterId = userInfo.staff.id;

        return await this.model.create({
            id: uuid.v1(),
            companyId,
            operaterId,
            customerId,
            total
        });
    }

    async put(ctx: Context) {
        let { id } = ctx.params;
        let companyId = ctx.state.users.company.id;
        let { customerId, total } = ctx.request.body;

        let _customer = await this.model.findById(id);
        if (!_customer) {
            throw new Error("order record does not exist.");
        }
        if (_customer.companyId != companyId) {
            throw new Error("order, Permission denied.");
        }

        customerId = customerId || _customer.customerId;
        total = total || _customer.total;

        return await this.model.update({
            customerId,
            total,
        }, {
                where: {
                    id
                }
            });
    }

    async delete(ctx: Context) {
        let { id } = ctx.params;
        let companyId = ctx.state.users.company.id;
        let _customer = await this.model.findById(id);
        if (!_customer) {
            throw new Error("order record does not exist.");
        }
        if (_customer.companyId != companyId) {
            throw new Error("order, Permission denied.");
        }

        return await this.model.update({
            deletedAt: moment().format()
        }, {
                where: {
                    id
                }
            });
    }
}

export let order = new Order(DB.models.order as Model<any, any>);
