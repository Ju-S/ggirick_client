import React from "react";
import moment from "moment";

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

export default function WeekendCalenderHeader({ date }) {
    const day = moment(date).day();
    const color = day === 0 ? "text-error" : day === 6 ? "text-primary" : "text-base";
    return <span className={color}>{weekDays[day]}</span>;
}
