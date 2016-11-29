"use strict";

import { h, Component } from "preact";

import { User, Jumbotron, Nav } from "../components";

export default class Publish extends Component {
    render() {
        return (
            <div>
                <User />
                <Jumbotron />
                <div className="mid">
                    <div className="main">
                        <Nav value={[{ name: "首页", value: "/" }, { name: "发布", value: null }]} />
                        <div className="post-message-container" style="display: none;">
                            <div className="content">
                                <textarea placeholder="在此输入您需要发布的消息……"></textarea>
                                <span className="character-remaining">1024</span>
                            </div>
                            <div className="metadata-container">
                                <div className="label">设置生效时间：</div>
                                <div className="range" data-start-time="2016-11-26 12:00:00" data-end-time="2016-11-29 10:00:00">
                                    <a className="thumb"></a>
                                    <span className="track"></span>
                                    <a className="thumb"></a>
                                </div>
                                <div className="range-ipt">
                                    <input type="text" value="2016-11-26 12:40:20" />-<input type="text" value="2016-11-27 10:20:00" />
                                </div>
                            </div>
                            <div className="tips">
                            </div>
                            <div className="btn-container">
                                <a className="btn btn-primary">发布</a>
                            </div>
                        </div>
                        <div className="posted-message-container">
                            <h2>发布成功！</h2>
                            <div className="message-link-text">
                                <span>https://awhile.online/anonymous/aeaeaeaeaeae</span>
                                <a className="copy-btn">复制</a>
                            </div>
                            <div className="qrcode">
                                <img src="images/qrcode.png" alt="https://awhile.online" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
