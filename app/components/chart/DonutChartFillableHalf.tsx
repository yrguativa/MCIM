import React from "react";
import { pie, arc, PieArcDatum } from "d3";
import { useSpring, animated } from "@react-spring/web";

type Item = { name: string; value: number };

// This component from: https://rosencharts.com/
export const DonutChartFillableHalf: React.FC<Item> = ({ name, value }) => {
    const radius = 420; // Chart base dimensions
    const lightStrokeEffect = 10; // 3d light effect around the slice
    
    // D3 layout and arc generators, these are pure functions and can be defined once
    const pieLayout = pie<Item>()
        .value((d) => d.value)
        .startAngle(-Math.PI / 2) // Start at -90 degrees (9 o'clock)
        .endAngle(Math.PI / 2)
        .sort(null) // Do not sort to preserve data order
        .padAngle(0.0);

    const innerRadius = radius / 1.625;
    const arcGenerator = arc<PieArcDatum<Item>>().innerRadius(innerRadius).outerRadius(radius);

    const arcClip =
        arc<PieArcDatum<Item>>()
            .innerRadius(innerRadius + lightStrokeEffect / 2)
            .outerRadius(radius)
            .cornerRadius(lightStrokeEffect + 2) || undefined;

    // A helper function to calculate path 'd' attributes for a given percentage
    const getPaths = (val: number) => {
        const clampedValue = Math.max(0, Math.min(100, val));
        const data = [
            { name: "Filled", value: clampedValue },
            { name: "Empty", value: 100 - clampedValue },
        ];
        const arcs = pieLayout(data);
        return {
            filled: {
                path: arcGenerator(arcs[0]) || "",
                clip: arcClip(arcs[0]) || "",
            },
            empty: {
                path: arcGenerator(arcs[1]) || "",
                clip: arcClip(arcs[1]) || "",
            },
        };
    };

    // useSpring hook to animate the value from 0 to the target value
    const { val } = useSpring({
        from: { val: 0 },
        to: { val: value },
        config: { mass: 1, tension: 120, friction: 80 },
    });

    const colors = {
        gray: "fill-[#e0e0e0] dark:fill-zinc-700",
        purple: "fill-violet-600 dark:fill-violet-500",
    };
    
    return (
        <div className="relative">
            <svg
                viewBox={`-${radius} -${radius} ${radius * 2} ${radius}`}
                className="max-w-[16rem] mx-auto overflow-visible"
            >
                <defs>
                    <clipPath id="fillable-half-donut-clip-filled">
                        <animated.path d={val.to(v => getPaths(v).filled.clip)} />
                    </clipPath>
                    <clipPath id="fillable-half-donut-clip-empty">
                        <animated.path d={val.to(v => getPaths(v).empty.clip)} />
                    </clipPath>
                </defs>
                <g>
                    {/* Slices */}
                    <g clipPath="url(#fillable-half-donut-clip-empty)">
                        <animated.path
                            className={`stroke-white/30 dark:stroke-zinc-400/10 ${colors.gray}`}
                            strokeWidth={lightStrokeEffect}
                            d={val.to(v => getPaths(v).empty.path)}
                        />
                    </g>
                    <g clipPath="url(#fillable-half-donut-clip-filled)">
                        <animated.path
                            className={`stroke-white/30 dark:stroke-zinc-400/10 ${colors.purple}`}
                                strokeWidth={lightStrokeEffect}
                            d={val.to(v => getPaths(v).filled.path)}
                            />
                    </g>
                </g>
                <text
                    transform={`translate(0, ${-radius / 4})`}
                    textAnchor="middle"
                    fontSize={48}
                    fontWeight="bold"
                    fill="currentColor"
                    className="text-zinc-700 dark:text-zinc-100"
                >
                    {name || "Meta"}
                </text>{" "}
                <animated.text
                    transform={`translate(0, ${-radius / 12})`}
                    textAnchor="middle"
                    fontSize={64}
                    fontWeight="bold"
                    fill="currentColor"
                    className="text-zinc-800 dark:text-zinc-300"
                >
                    {val.to(v => `${Math.round(v)}%`)}
                </animated.text>
            </svg>
        </div>
    );
}
