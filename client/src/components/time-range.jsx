"use strict";

import React, { Component } from "react";
import moment from "moment";

const FORMATTER = "YYYY-MM-DD HH:mm:ss";

class Track extends Component {
    constructor(...args) {
        super(...args);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }
    handleMouseDown(evt) {
        const target = evt.target;
        this.x = evt.clientX;
        const { left, width } = target.getBoundingClientRect();
        this.containerWidth  = target.parentNode.getBoundingClientRect().width;
        const offsetX = evt.clientX - left;
        if (offsetX <= 16) {
            this.movingParts = "start";
        } else if (offsetX >= width - 16) {
            this.movingParts = "end";
        } else {
            this.movingParts = "whole";
            document.body.style.cursor = "grabbing";
        }
        document.addEventListener("mousemove", this.handleMouseMove, false);
        document.addEventListener("mouseup", this.handleMouseUp, false);
    }
    handleMouseMove(evt) {
        const deltaX = evt.clientX - this.x;
        this.move(deltaX);
        this.x = evt.clientX;
    }
    handleMouseUp(evt) {
        document.removeEventListener("mousemove", this.handleMouseMove, false);
        document.removeEventListener("mouseup", this.handleMouseUp, false);
        const deltaX = evt.clientX - this.x;
        this.move(deltaX);
        this.movingParts = "";
        this.x = null;
        this.containerWidth = null;
        document.body.style.cursor = "";
    }
    move(deltaX) {
        if (deltaX === 0) return;
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
                    startTime = value.endTime - safeWidth;
                }
                this.props.onChange({
                    startTime,
                    endTime: value.endTime,
                });
                break;
            case "end":
                endTime = Math.min(value.endTime + offsetTime, end);
                if (endTime - value.startTime < safeWidth) {
                    endTime = value.startTime + safeWidth;
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
    }
    render() {
        const { start, end, value } = this.props;
        const length = end - start;
        const x = (value.startTime - start) / length * 100;
        const w = (value.endTime - value.startTime) / length * 100;
        const styl = {
            width: `${w.toFixed(6)}%`,
            left: `${x.toFixed(6)}%`,
        };
        return (
            <span className="track" style={styl}
                  onMouseDown={this.handleMouseDown}></span>
        );
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
                <div className="range"
                     data-start-time={this.timeToString(start)}
                     data-end-time={this.timeToString(end)}>
                    <Track start={start} end={end} value={range} onChange={onChange} />
                </div>
                <div className="range-ipt">
                    <input type="text" value={startTimeString}
                           onChange={this.handleStartTimeChange} />-<input
                    type="text" value={endTimeString} onChange={this.handleEndTimeChange} />
                </div>
            </div>
        );
    }
}
