"use strict";

// Ref: https://github.com/zpao/qrcode.react/blob/master/src/index.js

import { isObjectEqual } from "../utils";
import { h, Component } from "preact";

// qr.js doesn't handle error level of zero (M) so we need to do it right,
// thus the deep require.
import QRCodeImpl from "qr.js/lib/QRCode";
import ErrorCorrectLevel from "qr.js/lib/ErrorCorrectLevel";

function getBackingStorePixelRatio(ctx) {
    return (
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1
    );
}


export default class QRCode extends Component {
    shouldComponentUpdate(nextProps) {
        if (isObjectEqual(nextProps, this.props)) {
            return false;
        }
    }
    componentDidMount() {
        this.update();
    }
    componentDidUpdate() {
        this.update();
    }

    update() {
        const {
            value,
            size,
            level,
            bgColor,
            fgColor,
        } = this.props;

        // We'll use type===-1 to force QRCode to automatically pick the best type
        const qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
        qrcode.addData(value);
        qrcode.make();

        const canvas = this._canvas;

        const ctx = canvas.getContext("2d");
        const cells = qrcode.modules;
        const tileW = size / cells.length;
        const tileH = size / cells.length;
        const scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
        canvas.height = canvas.width = size * scale;
        ctx.scale(scale, scale);

        cells.forEach(function(row, rdx) {
            row.forEach(function(cell, cdx) {
                ctx.fillStyle = cell ? fgColor : bgColor;
                const w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW));
                const h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH));
                ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
            });
        });
    }

    render() {
        const { size } = this.props;
        return (
            <canvas
                style={{
                    width: size,
                    height: size,
                }}
                width={size} height={size} ref={ el => this._canvas = el } />
        );
    }
}

QRCode.defaultProps = {
    size: 128,
    level: "L",
    bgColor: "#FFFFFF",
    fgColor: "#000000",
};
