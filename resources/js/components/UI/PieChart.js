import React from 'react';

// Convert degrees to radians and adjust so 0deg is at 12 o'clock
const toRadians = (deg) => (deg - 90) * Math.PI / 180;

const polarToCartesian = (cx, cy, r, angleDeg) => {
  const a = toRadians(angleDeg);
  return {
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  };
};

const describeArc = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  // normalize delta in [0,360]
  let delta = endAngle - startAngle;
  if (delta < 0) delta += 360;
  const largeArcFlag = delta > 180 ? '1' : '0';
  // use sweepFlag=1 so arc is drawn in the expected (clockwise) direction
  const sweepFlag = '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y} Z`;
};

// data: [{label, value, color, labelColor?}]
const PieChart = ({ data = [], size = 200, innerRadius = 0 }) => {
  const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  let angle = 0;

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((slice, i) => {
          const v = Number(slice.value) || 0;
          if (v <= 0) return null; // skip zero-value slices

          const delta = (v / total) * 360;
          const startAngle = angle;
          const endAngle = angle + delta;

          // If this slice covers the full circle, SVG arc won't draw a 360deg arc correctly.
          // Draw a full circle instead in that case.
          const isFull = Math.abs(delta - 360) < 0.0001 || delta >= 359.999;

          const midAngle = startAngle + delta / 2;
          const labelPos = polarToCartesian(cx, cy, r * 0.62, midAngle);
          const percent = Math.round((v / total) * 100);

          angle = endAngle;

          return (
            <g key={i}>
              {isFull ? (
                // full circle (donut as needed)
                <circle cx={cx} cy={cy} r={r} fill={slice.color || '#ccc'} stroke="#fff" strokeWidth="0.5" />
              ) : (
                <path d={describeArc(cx, cy, r, startAngle, endAngle)} fill={slice.color || '#ccc'} stroke="#fff" strokeWidth="0.5" />
              )}

              {v > 0 && (
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  fill={slice.labelColor || '#fff'}
                  fontSize={12}
                  fontWeight={600}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {percent}%
                </text>
              )}
            </g>
          );
        })}

        {innerRadius > 0 && (
          <circle cx={cx} cy={cy} r={innerRadius} fill="#fff" />
        )}
      </svg>

      <div>
        {data.map((slice, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <div style={{ width: 12, height: 12, background: slice.color || '#000', borderRadius: 3 }} />
            <div style={{ fontSize: 14 }}>{slice.label}: <strong>{slice.value}</strong></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
