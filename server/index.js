"use strict";

import koa from "koa";
import koaStatic from "koa-static";
import { prepare, shutdown } from "./prepare";
import {
    HOST,
    PORT,
    ASSETS_PATH,
} from "../config";
import mountLayout from "./layout";
import mountApi from "./api";

const app = koa();

// mount /assets/
app.use(koaStatic(ASSETS_PATH));

// mount /v/{hash}
// mount /{GUEST_NAME}/{hash}
app.use(mountLayout());

// mount /api/
app.use(mountApi());

export default app;
if (!module.parent) {
    prepare().then(() => {
        app.listen(PORT, HOST, function () {
            console.log(this.address());
            // started
        });
    }, async err => {
        console.error(err);
        await shutdown();
        process.exit(1);
    });
}
