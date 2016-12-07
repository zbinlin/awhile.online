"use strict";

import { h, Component } from "preact";
import moment from "moment";

const isSupportTouch = "ontouchstart" in window;

const FORMATTER = "YYYY-MM-DD HH:mm:ss";

function debounce(func, interval = 1000 / 60) {
    let now = Date.now();
    return function _debounce_(...args) {
        if (Date.now() - now < interval) {
            return;
        }
        func(...args);
        now = Date.now();
    };
}

class Track extends Component {
    constructor(...args) {
        super(...args);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.move = debounce(this.move.bind(this), 16);
    }
    getXFrom(evt) {
        if (isSupportTouch) {
            return evt.changedTouches[0].clientX;
        } else {
            return evt.clientX;
        }
    }
    handleMouseDown(evt) {
        const target = evt.target;
        this.x = this.getXFrom(evt);
        const { left, width } = target.getBoundingClientRect();
        this.containerWidth  = target.parentNode.getBoundingClientRect().width;
        const offsetX = this.x - left;
        if (offsetX <= 6) {
            this.movingParts = "start";
            this.setState({
                activeCls: "start",
            });
        } else if (offsetX >= width - 6) {
            this.movingParts = "end";
            this.setState({
                activeCls: "end",
            });
        } else {
            this.movingParts = "whole";
            this.setState({
                activeCls: "whole",
            });
            document.body.style.cursor = "grabbing";
        }
        if (isSupportTouch) {
            document.addEventListener("touchmove", this.handleMouseMove, false);
            document.addEventListener("touchend", this.handleMouseUp, false);
            document.addEventListener("touchcancel", this.handleMouseUp, false);
        } else {
            document.addEventListener("mousemove", this.handleMouseMove, false);
            document.addEventListener("mouseup", this.handleMouseUp, false);
        }
    }
    handleMouseMove(evt) {
        this.tryToMove(evt);
    }
    handleMouseUp(evt) {
        if (isSupportTouch) {
            document.removeEventListener("touchmove", this.handleMouseMove, false);
            document.removeEventListener("touchend", this.handleMouseUp, false);
            document.removeEventListener("touchcancel", this.handleMouseUp, false);
        } else {
            document.removeEventListener("mousemove", this.handleMouseMove, false);
            document.removeEventListener("mouseup", this.handleMouseUp, false);
        }
        this.tryToMove(evt);
        this.movingParts = "";
        this.x = null;
        this.containerWidth = null;
        document.body.style.cursor = "";
        this.setState({
            activeCls: "",
        });
    }
    tryToMove(evt) {
        const x = this.getXFrom(evt);
        this.deltaX = x - this.x;
        this.move(() => (this.x = x, this.deltaX = 0));
    }
    move(callback) {
        const deltaX = this.deltaX;
        if (!this.deltaX) return;
        const { start, end, value } = this.props;
        const length = end - start;
        let ratio = deltaX / this.containerWidth;
        if (ratio > 1) {
            ratio = 1;
        } else if (ratio < -1) {
            ratio = -1;
        }
        let startTime, endTime;
        const safeWidth = 16 / this.containerWidth * length;
        const offsetTime = ratio * length;
        switch (this.movingParts) {
            case "start":
                startTime = Math.max(start, value.startTime + offsetTime);
                if (value.endTime - startTime < safeWidth) {
                    startTime = Math.max(start, value.endTime - safeWidth);
                }
                this.props.onChange({
                    startTime,
                    endTime: value.endTime,
                });
                break;
            case "end":
                endTime = Math.min(value.endTime + offsetTime, end);
                if (endTime - value.startTime < safeWidth) {
                    endTime = Math.min(value.startTime + safeWidth, end);
                }
                this.props.onChange({
                    startTime: value.startTime,
                    endTime,
                });
                break;
            case "whole":
                startTime = value.startTime + offsetTime;
                endTime = value.endTime + offsetTime;
                if (startTime < start) {
                    startTime = start;
                    endTime = startTime + (value.endTime - value.startTime);
                }
                if (endTime > end) {
                    endTime = end;
                    startTime = endTime - (value.endTime - value.startTime);
                }
                this.props.onChange({
                    startTime,
                    endTime,
                });
                break;
            default:
                return;
        }
        callback();
    }
    render() {
        const { start, end, value } = this.props;
        const { activeCls } = this.state;
        const length = end - start;
        const x = (value.startTime - start) / length * 100;
        const w = (value.endTime - value.startTime) / length * 100;
        const styl = {
            width: `${w.toFixed(6)}%`,
            left: `${x.toFixed(6)}%`,
        };
        if (isSupportTouch) {
            return (
                <span className={`track ${activeCls}`} style={styl}
                      onTouchStart={this.handleMouseDown}></span>
            );
        } else {
            return (
                <span className={`track ${activeCls}`} style={styl}
                      onMouseDown={this.handleMouseDown}></span>
            );
        }
    }
}

export default class TimeRange extends Component {
    constructor(...args) {
        super(...args);
        this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
        this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    }
    timeToString(t) {
        return moment.unix(t).format(FORMATTER);
    }
    parseStringTime(str) {
        const m = moment(str, FORMATTER, false);
        if (m.isValid()) {
            return m.unix();
        } else {
            throw new Error(`${str} is not valid time string`);
        }
    }
    handleStartTimeChange(evt) {
        const target = evt.target;
        const value = target.value;
        const { start, end, value: range } = this.props;
        try {
            const startTime = Math.min(
                Math.max(start, this.parseStringTime(value)),
                range.endTime - (end - start) * 0.01,
            );
            this.props.onChange(Object.assign({}, range, {
                startTime,
            }));
        } catch (ex) {
            // empty
        }
    }
    handleEndTimeChange(evt) {
        const target = evt.target;
        const value = target.value;
        const { start, end, value: range } = this.props;
        try {
            const endTime = Math.max(
                range.startTime + (end - start) * 0.01,
                Math.min(this.parseStringTime(value), end),
            );
            this.props.onChange(Object.assign({}, range, {
                endTime,
            }));
        } catch (ex) {
            // empty
        }
    }
    render() {
        const { value: range, start, end, onChange } = this.props;
        const startTimeString = this.timeToString(range.startTime);
        const endTimeString = this.timeToString(range.endTime);
        return (
            <div className="time-range-container">
                <div className="range-ipt">
                    <input type="text" value={startTimeString}
                           onChange={this.handleStartTimeChange} />-<input
                    type="text" value={endTimeString} onChange={this.handleEndTimeChange} />
                </div>
                <div className="range"
                     data-start-time={this.timeToString(start)}
                     data-end-time={this.timeToString(end)}>
                    <Track start={start} end={end} value={range} onChange={onChange} />
                </div>
            </div>
        );
    }
}
