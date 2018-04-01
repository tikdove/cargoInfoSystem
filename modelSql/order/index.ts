/*
 * @Author: Mr.He 
 * @Date: 2018-04-01 12:09:49 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2018-04-01 17:46:11
 * @content what is the content of this file. */


import sequelize = require("sequelize");
import { DB } from "common/db";
import { customer } from '../../model/customer/index';

let columns = {
    id: {
        type: sequelize.UUID,
        primaryKey: true,
    },
    companyId: {
        type: sequelize.UUID,
        allowNull: false,
    },
    //added staff's id
    operaterId: {
        type: sequelize.UUID,
        allowNull: false,
    },
    customerId: {
        type: sequelize.UUID,
        allowNull: false,
    },
    price: {
        type: sequelize.NUMERIC,
        allowNull: false,
    },
    deletedAt: {
        type: sequelize.DATE,
        allowNull: true,
    }
}

let options = {
    indexes: [
        {
            name: "order_company_id",
            fields: ['companyId']
        },
        {
            name: "order_customer_id",
            fields: ["customerId"]
        },
        {
            name: "order_operater_id",
            fields: ["operaterId"]
        },
    ],
    underscored: true,
    timestamps: true,
    tableName: 'order'
}
DB.models.order = DB.define('Order', columns, options);