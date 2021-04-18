import moment from "moment";
import { useEffect, useState } from "react";
import { TimerPolicy } from "./types";

export const useOrderTimer = (p: {
  timer: TimerPolicy;
  orderedAt: Date;
  stopCounterAt?: Date;
}) => {
  const getStatus = () => {
    const diff = moment(p.stopCounterAt || undefined).diff(
      p.orderedAt,
      p.timer.unit
    );

    if (diff > p.timer.maximum) {
      return "EXCEED";
    } else if (diff > p.timer.danger) {
      return "DANGER";
    } else if (diff > p.timer.warning) {
      return "WARNING";
    } else {
      return "NORMAL";
    }
  };
  const [status, setStatus] = useState<ReturnType<typeof getStatus>>(
    getStatus()
  );
  const [ts, setTs] = useState<number>(new Date().getTime());
  useEffect(() => {
    const intv = setInterval(() => {
      setStatus(getStatus());
      setTs(new Date().getTime());
    }, 1000);
    if (p.stopCounterAt) {
      clearInterval(intv);
    }
    return () => {
      clearInterval(intv);
    };
  }, []);
  const c = {
    EXCEED: "red-500",
    DANGER: "red-500 ",
    WARNING: "yellow-600",
    NORMAL: "gray-700",
  }[status];

  const remaingSec = moment(p.stopCounterAt || undefined).diff(
    p.orderedAt,
    "seconds"
  );
  const remaingMin = moment(p.stopCounterAt || undefined).diff(
    p.orderedAt,
    "minutes"
  );
  const remaingMinStr = moment.utc(remaingSec * 1000).format("HH:mm:ss");
  const percent = Math.min(100, (remaingSec / p.timer.maximum) * 100);

  return {
    border: `transition-all border-solid	border-2 border-${c}`, //text-red
    text: `transition-all	 text-${c}`, //text-red
    bg: `transition-all	 text-white bg-${c}`, //bg-read text-white
    remaingMin: `${remaingMinStr}`, //3:00นาที
    percent, //90
    start: moment(p.orderedAt).format("HH:mm") + " น.", //12:00น.
    status, //NORMAL WARNING DANGER
  };
};
