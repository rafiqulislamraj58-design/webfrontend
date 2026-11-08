
import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Network, Code2, Users, GraduationCap } from "lucide-react";

const HUB = { name: "Dhaka", lon: 90.41, lat: 23.81 };

const CITIES = [
  { name: "Rangpur", lon: 89.25, lat: 25.74, side: "right" },
  { name: "Rajshahi", lon: 88.6, lat: 24.37, side: "right" },
  { name: "Mymensingh", lon: 90.4, lat: 24.75, side: "right" },
  { name: "Sylhet", lon: 91.87, lat: 24.9, side: "left" },
  { name: "Khulna", lon: 89.55, lat: 22.82, side: "left" },
  { name: "Barishal", lon: 90.37, lat: 22.7, side: "right" },
  { name: "Chattogram", lon: 91.83, lat: 22.36, side: "left" },
  { name: "Cox's Bazar", lon: 91.98, lat: 21.43, side: "left" },
];

const BORDER = [
  [88.45, 26.62], [88.85, 26.47], [89.05, 26.25],
  [89.55, 26.2], [89.85, 25.95], [89.8, 25.5],
  [90.15, 25.2], [90.7, 25.15], [91.2, 25.18],
  [91.7, 25.12], [92.1, 25.05], [92.25, 24.8],
  [92.2, 24.4], [91.95, 24.1], [91.65, 24.05],
  [91.4, 23.8], [91.2, 23.5], [91.3, 23.1],
  [91.6, 23.2], [91.95, 23.65], [92.25, 23.4],
  [92.4, 22.95], [92.35, 22.45], [92.25, 21.95],
  [92.15, 21.5], [92.25, 21.1], [92.3, 20.75],
  [92.32, 20.6], [92.05, 21.15], [91.95, 21.55],
  [91.85, 22.05], [91.8, 22.35], [91.6, 22.65],
  [91.4, 22.85], [91.2, 22.7], [91.05, 22.4],
  [90.75, 22.1], [90.5, 21.98], [90.2, 21.82],
  [89.85, 21.8], [89.5, 21.8], [89.15, 21.72],
  [89.0, 22.0], [88.92, 22.4], [88.8, 22.75],
  [88.75, 23.05], [88.95, 23.35], [88.6, 23.6],
  [88.7, 23.95], [88.4, 24.3], [88.1, 24.6],
  [88.15, 24.95], [88.45, 25.15], [88.4, 25.5],
  [88.1, 25.8], [88.1, 26.2], [88.2, 26.45],
];

const S = 88;
const LON0 = 87.9;
const LAT0 = 26.8;
const KX = 0.917;

const project = (lon, lat) => [
  (lon - LON0) * KX * S,
  (LAT0 - lat) * S,
];

const format = (n) => n.toFixed(1);

function smoothPath(points) {
  const mid = (a, b) => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ];

  const start = mid(points[points.length - 1], points[0]);

  let path = `M${format(start[0])} ${format(start[1])}`;

  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    const middle = mid(point, next);

    path += `Q${format(point[0])} ${format(point[1])} ${format(middle[0])} ${format(middle[1])}`;
  });

  return `${path}Z`;
}

function createArc(start, end, bend = 0.2) {
  const cx = (start[0] + end[0]) / 2 - (end[1] - start[1]) * bend;
  const cy = (start[1] + end[1]) / 2 + (end[0] - start[0]) * bend;

  return `M${format(start[0])} ${format(start[1])}Q${format(cx)} ${format(cy)} ${format(end[0])} ${format(end[1])}`;
}

const COUNTRY_PATH = smoothPath(BORDER.map(([lon, lat]) => project(lon, lat)));
const HUB_XY = project(HUB.lon, HUB.lat);

const NODES = CITIES.map((city, index) => {
  const [x, y] = project(city.lon, city.lat);

  return {
    ...city,
    x,
    y,
    d: createArc(HUB_XY, [x, y], index % 2 ? 0.18 : -0.18),
    delay: index * 0.3,
    duration: 2.4 + (index % 4) * 0.45,
  };
});

const KHULNA = NODES.find((node) => node.name === "Khulna");

const LEARNER_BEAM = createArc(
  [42, 503],
  [KHULNA.x, KHULNA.y],
  -0.22
);

const COMMUNITY_ITEMS = [
  {
    icon: Users,
    title: "Peer Learning",
    description: "Collaborate with other passionate learners.",
  },
  {
    icon: GraduationCap,
    title: "Expert Mentorship",
    description: "Get guidance from experienced instructors.",
  },
  {
    icon: Code2,
    title: "Real Projects",
    description: "Build practical skills through real projects.",
  },
];

export default function CommunityNetwork() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(null);

  const animation = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 25 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-50px" },
          transition: {
            duration: 0.65,
            delay,
            ease: [0.22, 1, 0.36, 1],
          },
        };

  return (
    <section
      aria-labelledby="community-title"
      className="relative overflow-hidden bg-[#07111f] py-24 text-white sm:py-28"
    >
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10">

        <motion.div {...animation()}>

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
            <Network size={15} />
            Community & Reach
          </div>

          <h2
            id="community-title"
            className="text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl"
          >
            A Connected
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Learning Network.
            </span>
          </h2>

          <p className="mt-7 max-w-lg text-base leading-8 text-slate-400 sm:text-lg">
            Technology brings people together. We believe in creating a
            learning community where students can collaborate, share
            knowledge and grow together beyond geographical boundaries.
          </p>

          <div className="mt-10 space-y-5">
            {COMMUNITY_ITEMS.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                {...animation(index * 0.1)}
                className="group flex items-center gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 transition duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.05]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400 group-hover:text-slate-950">
                  <Icon size={23} />
                </div>

                <div>
                  <h3 className="font-bold text-white">{title}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-8">
            <div>
              <p className="text-3xl font-black text-cyan-300">08+</p>
              <p className="mt-1 text-xs text-slate-500">Connected cities</p>
            </div>
            <div>
              <p className="text-3xl font-black text-cyan-300">01</p>
              <p className="mt-1 text-xs text-slate-500">Central hub</p>
            </div>
            <div>
              <p className="text-3xl font-black text-cyan-300">∞</p>
              <p className="mt-1 text-xs text-slate-500">Learning possibilities</p>
            </div>
          </div>

        </motion.div>

        <motion.div
          {...animation(0.15)}
          className="relative mx-auto w-full max-w-[510px]"
        >
          <div className="absolute inset-10 rounded-full bg-cyan-400/10 blur-[90px]" />

          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[#0b1b2d] p-4 shadow-2xl shadow-cyan-950/30 sm:p-7">

            <div className="relative mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">
                  Bangladesh Network
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Interactive learning connections
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Connected
              </div>
            </div>

            <NetworkMap
              active={active}
              setActive={setActive}
              animate={!reduceMotion}
            />

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {NODES.map((node) => {
                const selected = active === node.name;

                return (
                  <button
                    key={node.name}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActive(selected ? null : node.name)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                      selected
                        ? "border-cyan-300 bg-cyan-300 text-slate-950"
                        : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-cyan-300/50 hover:text-white"
                    }`}
                  >
                    {node.name}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <MapPin size={19} className="text-cyan-300" />
              <div>
                <p className="text-xs font-bold text-white">
                  {active || "Dhaka Learning Hub"}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {active
                    ? "Connected learning location"
                    : "Central connection point"}
                </p>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

function NetworkMap({ active, setActive, animate }) {
  const uid = useId().replace(/:/g, "");
  const clipId = `country-${uid}`;
  const dotsId = `dots-${uid}`;
  const scanId = `scan-${uid}`;

  return (
    <svg
      viewBox="-20 -10 420 580"
      role="img"
      aria-label="Illustrated Bangladesh learning network connecting Dhaka with eight cities."
      className="relative mx-auto h-auto w-full"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={COUNTRY_PATH} />
        </clipPath>

        <pattern id={dotsId} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="1.3" fill="#22d3ee" opacity="0.55" />
        </pattern>

        <linearGradient id={scanId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset=".5" stopColor="#22d3ee" stopOpacity=".4" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={COUNTRY_PATH} fill="rgba(34,211,238,0.07)" />

      <rect
        x="-20"
        y="-10"
        width="420"
        height="580"
        fill={`url(#${dotsId})`}
        clipPath={`url(#${clipId})`}
      />

      {animate && (
        <g clipPath={`url(#${clipId})`}>
          <rect
            x="-20"
            y="-90"
            width="420"
            height="90"
            fill={`url(#${scanId})`}
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="0 680"
              dur="5.5s"
              repeatCount="indefinite"
            />
          </rect>
        </g>
      )}

      <path
        d={COUNTRY_PATH}
        fill="none"
        stroke="#22d3ee"
        strokeOpacity=".75"
        strokeWidth="1.5"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,.5))" }}
      />

      {NODES.map((node) => (
        <g key={node.name}>
          <path
            d={node.d}
            fill="none"
            stroke="#67e8f9"
            strokeWidth={active === node.name ? 2.2 : 1.2}
            strokeOpacity={active === node.name ? 1 : 0.45}
            strokeDasharray="4 5"
          >
            {animate && (
              <animate
                attributeName="stroke-dashoffset"
                from="18"
                to="0"
                dur="1.2s"
                repeatCount="indefinite"
              />
            )}
          </path>

          {animate && (
            <circle r="2.8" fill="#fff">
              <animateMotion
                path={node.d}
                dur={`${node.duration}s`}
                begin={`${node.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          )}
        </g>
      ))}

      {NODES.map((node) => {
        const selected = active === node.name;

        return (
          <g
            key={node.name}
            onMouseEnter={() => setActive(node.name)}
            onMouseLeave={() => setActive(null)}
          >
            {animate && (
              <circle cx={node.x} cy={node.y} r="5" fill="#22d3ee" opacity=".4">
                <animate
                  attributeName="r"
                  values="5;16"
                  dur="2.6s"
                  begin={`${node.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values=".45;0"
                  dur="2.6s"
                  begin={`${node.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}

            <circle
              cx={node.x}
              cy={node.y}
              r={selected ? 7 : 5}
              fill="#22d3ee"
              stroke={selected ? "#fff" : "#071426"}
              strokeWidth="2"
            />

            <text
              x={node.x + (node.side === "left" ? -11 : 11)}
              y={node.y + 4}
              textAnchor={node.side === "left" ? "end" : "start"}
              fontSize="11"
              fontWeight={selected ? 700 : 600}
              fill={selected ? "#fff" : "#cbd5e1"}
              stroke="#071426"
              strokeWidth="3"
              paintOrder="stroke"
            >
              {node.name}
            </text>
          </g>
        );
      })}

      <g>
        {animate && (
          <circle
            cx={HUB_XY[0]}
            cy={HUB_XY[1]}
            r="8"
            fill="#e879f9"
            opacity=".5"
          >
            <animate
              attributeName="r"
              values="8;26"
              dur="2.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values=".55;0"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        <circle
          cx={HUB_XY[0]}
          cy={HUB_XY[1]}
          r="8"
          fill="#e879f9"
          stroke="#fff"
          strokeWidth="2.5"
        />

        <text
          x={HUB_XY[0] + 14}
          y={HUB_XY[1] + 4}
          fontSize="12"
          fontWeight="800"
          fill="#fff"
          stroke="#071426"
          strokeWidth="3.5"
          paintOrder="stroke"
        >
          Dhaka
        </text>
      </g>

      <path
        d={LEARNER_BEAM}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="1.8"
        strokeDasharray="5 6"
      />

      {animate && (
        <circle r="3" fill="#fff">
          <animateMotion
            path={LEARNER_BEAM}
            dur="2.2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      <g transform="translate(-18 450) scale(.55)">
        <Learner animate={animate} />
      </g>
    </svg>
  );
}

function Learner({ animate }) {
  const skin = "#f2c9a0";

  return (
    <g>
      <g>
        {animate && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;0 -6;0 0"
            dur="3.2s"
            repeatCount="indefinite"
          />
        )}
        <rect x="2" y="26" width="50" height="22" rx="7" fill="#0f2a47" stroke="#22d3ee" />
        <text x="27" y="41" textAnchor="middle" fontSize="12" fill="#67e8f9">
          {"</>"}
        </text>
      </g>

      <g>
        {animate && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;0 -7;0 0"
            dur="2.6s"
            begin=".8s"
            repeatCount="indefinite"
          />
        )}
        <rect x="164" y="14" width="46" height="22" rx="7" fill="#0f2a47" stroke="#e879f9" />
        <text x="187" y="29" textAnchor="middle" fontSize="12" fill="#f0abfc">
          {"{ }"}
        </text>
      </g>

      <path d="M98 16 Q110 6 122 16 M90 8 Q110 -8 130 8" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />

      <rect x="10" y="172" width="200" height="8" rx="4" fill="#1e3a5f" />
      <path d="M62 172V132Q62 100 110 98Q158 100 158 132V172Z" fill="#0ea5e9" />

      <circle cx="110" cy="62" r="26" fill={skin} />
      <path d="M84 58Q86 30 110 32Q136 30 136 58Q126 44 110 46Q94 44 84 58Z" fill="#1e293b" />
      <circle cx="101" cy="64" r="2.4" fill="#0f172a" />
      <circle cx="119" cy="64" r="2.4" fill="#0f172a" />
      <path d="M102 74Q110 80 118 74" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />

      <path d="M82 60Q82 32 110 32Q138 32 138 60" stroke="#22d3ee" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="75" y="56" width="11" height="20" rx="4" fill="#22d3ee" />
      <rect x="134" y="56" width="11" height="20" rx="4" fill="#22d3ee" />

      <rect x="56" y="112" width="108" height="58" rx="7" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <circle cx="110" cy="141" r="7" fill="#22d3ee">
        {animate && (
          <animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite" />
        )}
      </circle>
      <rect x="44" y="168" width="132" height="6" rx="3" fill="#475569" />

      <path d="M64 122Q48 150 70 164 M156 122Q172 150 150 164" stroke="#0ea5e9" strokeWidth="13" strokeLinecap="round" fill="none" />

      <ellipse cx="74" cy="166" rx="8" ry="5" fill={skin}>
        {animate && (
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur=".5s" repeatCount="indefinite" />
        )}
      </ellipse>

      <ellipse cx="146" cy="166" rx="8" ry="5" fill={skin}>
        {animate && (
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur=".5s" begin=".25s" repeatCount="indefinite" />
        )}
      </ellipse>
    </g>
  );
}
