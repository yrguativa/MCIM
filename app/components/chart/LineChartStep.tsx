import React, { CSSProperties } from "react";

import { scaleTime, scaleLinear, max, line as d3_line, curveStep } from "d3";

type LineChartStepProps = {
    data: {
        start: Date;
        end: Date;
        value: number
    }[];
};


export const LineChartStep: React.FC<LineChartStepProps> = ({ data }) => {
    if (data.length === 0) {
        return null;
    }

    const xScale = scaleTime()
        .domain([data[0].start, data[data.length - 1].end])
        .range([0, 100]);

    const yScale = scaleLinear()
        .domain([0, max(data.map((d) => d.value)) ?? 0])
        .range([100, 0]);

    const line = d3_line<(typeof data)[number]>()
        .x((d) => xScale(d.end))
        .y((d) => yScale(d.value))
        .curve(curveStep);

    const d = line(data);

    if (!d) {
        return null;
    }

    return (
        <div
            className="relative h-72 w-full"
            style={
                {
                    "--marginTop": "0px",
                    "--marginRight": "8px",
                    "--marginBottom": "25px",
                    "--marginLeft": "25px",
                } as CSSProperties
            }
        >
            {/* Y axis */}
            <div
                className="absolute inset-0 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible"
            >
                {yScale
                    .ticks(8)
                    .map(yScale.tickFormat(8, "d"))
                    .map((value, i) => (
                        <div
                            key={i}
                            style={{
                                top: `${yScale(+value)}%`,
                                left: "0%",
                            }}
                            className="absolute text-xs tabular-nums -translate-y-1/2 text-gray-500 w-full text-right pr-2"
                        >
                            {value}
                        </div>
                    ))}
            </div>

            {/* Chart area */}
            <div
                className="absolute inset-0 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible"
            >
                <svg
                    viewBox="0 0 100 100"
                    className="overflow-visible w-full h-full"
                    preserveAspectRatio="none"
                >
                    {/* Grid lines */}
                    {yScale
                        .ticks(8)
                        .map(yScale.tickFormat(8, "d"))
                        .map((active, i) => (
                            <g
                                transform={`translate(0,${yScale(+active)})`}
                                className="text-zinc-300 dark:text-zinc-700"
                                key={i}
                            >
                                <line
                                    x1={0}
                                    x2={100}
                                    stroke="currentColor"
                                    strokeDasharray="6,5"
                                    strokeWidth={0.5}
                                    vectorEffect="non-scaling-stroke"
                                />
                            </g>
                        ))}

                    {/* Line */}
                    <path
                        d={d}
                        fill="none"
                        stroke="url(#lineStep-gradient)"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                    />
                    <defs>
                        <linearGradient id="lineStep-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="currentColor" className="text-emerald-500" />
                            <stop offset="100%" stopColor="currentColor" className="text-lime-400" />
                        </linearGradient>
                    </defs>


                </svg>

                <div className="translate-y-2">
                    {/* X Axis */}
                    {data.map((day, i) => {
                        return (
                            <div key={i} className="overflow-visible text-zinc-500">
                                <div
                                    style={{
                                        left: `${xScale(day.end)}%`,
                                        top: "100%",
                                        transform: `translateX(-50%)`,
                                    }}
                                    className="text-xs absolute"
                                >
                                    {day.end.toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
