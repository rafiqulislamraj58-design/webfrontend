
import { useRef, useLayoutEffect } from "react";
import {
  useRef as useReactRef
} from "react";
import {
  MapPin,
  Phone,
  Mail,
  MonitorPlay,
  ArrowUpRight,
  MoveRight,
  Sparkles,
  Globe2,
  GraduationCap
} from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const activities = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1200&auto=format&fit=crop",
    title: "Web Development Bootcamp",
    category: "Learning & Growth",
    number: "01",
    description:
      "Building practical development skills through hands-on projects, collaborative learning and real-world experiences."
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    title: "Community Meetups",
    category: "Community",
    number: "02",
    description:
      "Connecting passionate learners, exchanging ideas and building meaningful professional relationships."
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    title: "Expert Masterclasses",
    category: "Knowledge",
    number: "03",
    description:
      "Learning from industry experts through insightful sessions, technical workshops and interactive seminars."
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1200&auto=format&fit=crop",
    title: "Problem Solving",
    category: "Innovation",
    number: "04",
    description:
      "Developing logical thinking and technical confidence by solving practical programming challenges."
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    title: "Career Development",
    category: "Future Ready",
    number: "05",
    description:
      "Preparing students for professional opportunities with career guidance, practical knowledge and mentorship."
  }
];

const contactItems = [
  {
    icon: MapPin,
    title: "Our Location",
    value: "1/1 Lagalia Road, Harinal, Joydebpur, Gazipur, Bangladesh",
    link: "https://maps.google.com/?q=Harinal,+Joydebpur,+Gazipur,+Bangladesh"
  },
  {
    icon: Phone,
    title: "Phone Number",
    value: "01913-500503",
    link: "tel:+8801913500503"
  },
  {
    icon: Mail,
    title: "Email Address",
    value: "dreamrevolution2@gmail.com",
    link: "mailto:dreamrevolution2@gmail.com"
  },
  {
    icon: MonitorPlay,
    title: "Learning Platform",
    value: "Online Classes & Dedicated Support",
    link: null
  }
];

export default function About() {
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = horizontalRef.current;

    if (!container || !track) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".activity-card");

      gsap.from(".about-reveal", {
        y: 45,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-intro",
          start: "top 80%"
        }
      });

      gsap.from(".contact-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-grid",
          start: "top 80%"
        }
      });

      const getDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const horizontalTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.65, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "left 85%",
              end: "left 35%",
              scrub: true
            }
          }
        );
      });

      ScrollTrigger.refresh();
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-[#050505] text-white min-h-screen overflow-x-hidden font-sans">

      <section className="relative px-6 pt-28 pb-24">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">

          <div className="about-intro text-center max-w-4xl mx-auto mb-20">

            <div className="about-reveal inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] rounded-full px-5 py-2 text-xs tracking-[0.25em] uppercase text-indigo-300 mb-8">
              <Sparkles size={14} />
              Dream Revolution
            </div>

            <h1 className="about-reveal text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.12] mb-8">
              Empowering The Next
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Generation Of Tech Leaders.
              </span>
            </h1>

            <p className="about-reveal text-zinc-400 text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
              We are more than an IT training institute. We are a community
              committed to transforming passionate learners into confident
              professionals through technology, creativity and innovation.
            </p>

            <div className="about-reveal flex justify-center mt-10">
              <a
                href="#our-activities"
                className="group inline-flex items-center gap-3 text-black rounded-full px-7 py-4 font-bold text-sm hover:bg-indigo-500 hover:text-white transition-all duration-300"
              >
                Discover Our Journey
                <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
              </a>
            </div>

          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">

            <div className="contact-grid grid sm:grid-cols-2 gap-4">

              {contactItems.map((item, index) => {
                const Icon = item.icon;

                const content = (
                  <div className="contact-card group relative h-full min-h-[190px] rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-indigo-400/40 hover:bg-indigo-500/[0.06] overflow-hidden">

                    <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">

                      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                        <Icon size={23} />
                      </div>

                      <h3 className="font-bold text-lg mb-3">
                        {item.title}
                      </h3>

                      <p className="text-zinc-400 text-sm leading-relaxed break-words group-hover:text-zinc-200 transition-colors">
                        {item.value}
                      </p>

                    </div>
                  </div>
                );

                return item.link ? (
                  <a
                    key={index}
                    href={item.link}
                    target={item.link.startsWith("http") ? "_blank" : undefined}
                    rel={item.link.startsWith("http") ? "noreferrer" : undefined}
                    className="block"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={index}>{content}</div>
                );
              })}

            </div>

            <div className="relative min-h-[420px] rounded-[2rem] overflow-hidden border border-white/10 group">

              <iframe
                title="Dream Revolution Institute Location"
                src="https://maps.google.com/maps?q=Harinal,%20Joydebpur,%20Gazipur,%20Bangladesh&t=m&z=14&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full border-0 grayscale invert-[90%] hue-rotate-180 contrast-100 opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div className="absolute bottom-5 left-5 right-5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-4 pointer-events-none">

                <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                  <MapPin size={23} />
                </div>

                <div>
                  <h3 className="font-bold text-sm">Visit Our Institute</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Harinal, Joydebpur, Gazipur
                  </p>
                </div>

                <ArrowUpRight className="ml-auto text-indigo-400 shrink-0" />

              </div>

            </div>

          </div>

        </div>

      </section>

      <section
        id="our-activities"
        ref={containerRef}
        className="relative h-screen min-h-[700px] flex flex-col justify-center overflow-hidden border-t border-white/[0.06] bg-[#080808]"
      >

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/[0.06] blur-[150px] rounded-full" />
        </div>

        <div className="absolute top-16 md:top-20 left-0 w-full px-6 z-10 text-center pointer-events-none">

          <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-[0.3em] uppercase mb-5">
            <Globe2 size={15} />
            Our Impact
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">
            Learning Beyond
            <span className="text-indigo-400"> Boundaries.</span>
          </h2>

          <p className="text-zinc-500 text-sm md:text-base mt-5 max-w-xl mx-auto">
            Experiences, collaboration and innovation that shape tomorrow's
            technology leaders.
          </p>

        </div>

        <div
          ref={horizontalRef}
          className="relative flex items-center gap-5 md:gap-8 w-max px-8 md:px-16 pt-44 md:pt-48"
        >

          {activities.map((item, index) => (

            <article
              key={item.id}
              className={`activity-card relative w-[290px] sm:w-[360px] md:w-[450px] h-[390px] md:h-[470px] flex-shrink-0 rounded-[2rem] overflow-hidden border border-white/10 group ${index % 2 === 0 ? "-translate-y-0" : "translate-y-8 md:translate-y-12"}`}
            >

              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

              <div className="absolute top-6 left-6 right-6 flex justify-between items-center">

                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-semibold tracking-wide">
                  {item.category}
                </span>

                <span className="text-white/50 text-sm font-bold tracking-widest">
                  / {item.number}
                </span>

              </div>

              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">

                <div className="w-10 h-[2px] bg-indigo-400 mb-5 group-hover:w-20 transition-all duration-500" />

                <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
                  {item.title}
                </h3>

                <p className="text-zinc-300 text-sm leading-relaxed max-w-sm opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                  {item.description}
                </p>

                <div className="flex items-center gap-3 mt-7 text-indigo-300 text-sm font-bold">
                  Explore Experience
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>

              </div>

              <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-400/30 rounded-[2rem] transition-all duration-500 pointer-events-none" />

            </article>

          ))}

          <div className="w-[200px] flex-shrink-0 flex flex-col justify-center items-center text-center pr-10">

            <div className="w-16 h-16 rounded-full border border-indigo-400/30 bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
              <GraduationCap size={30} />
            </div>

            <h3 className="text-2xl font-bold mb-3">
              Your Journey
              <span className="block text-indigo-400">Starts Here.</span>
            </h3>

            <p className="text-zinc-500 text-sm leading-relaxed">
              Be part of a community that builds the future.
            </p>

          </div>

        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4 text-zinc-500 text-xs tracking-widest uppercase">
          <MoveRight size={17} className="text-indigo-400" />
          Scroll To Explore
        </div>

      </section>

      <section className="relative py-32 px-6 text-center overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.06] to-transparent pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 mb-8">
            <GraduationCap size={32} />
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-7">
            Ready To Build
            <span className="block text-indigo-400">Your Future?</span>
          </h2>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10">
            Every great journey starts with a single step. Discover your
            potential and become part of the next generation of tech leaders.
          </p>

          <a
            href="tel:+8801913500503"
            className="inline-flex items-center gap-3 rounded-full text-black px-8 py-4 font-bold hover:bg-indigo-500 text-black hover: transition-all duration-300 group"
          >
            Get In Touch
            <ArrowUpRight size={19} className="group-hover:rotate-45 transition-transform" />
          </a>

        </div>

      </section>

    </main>
  );
}
