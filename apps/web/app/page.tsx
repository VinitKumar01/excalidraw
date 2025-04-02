"use client";

import Image from "next/image";
import {
  ArrowRightIcon,
  BrushIcon,
  UsersIcon,
  CodeIcon,
  GithubIcon,
} from "./icons";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BrushIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#0284c7] to-violet-600 text-transparent bg-clip-text">
                Excalidraw Clone
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <button
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-[#0284c7] text-white hover:bg-[#0369a1] focus:ring-2 focus:ring-[#0ea5e9] focus:ring-offset-2"
                onClick={() => {
                  router.push("/signup");
                }}
              >
                Sign Up <ArrowRightIcon className="ml-2 h-4 w-4" />
              </button>
              <button
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-[#0284c7] text-white hover:bg-[#0369a1] focus:ring-2 focus:ring-[#0ea5e9] focus:ring-offset-2"
                onClick={() => {
                  router.push("/signin");
                }}
              >
                Sign In <ArrowRightIcon className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 bg-gradient-to-b from-[#f0f9ff] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-[#f0f9ff] border border-[#e0f2fe] rounded-full px-4 py-2 mb-8">
            <span className="text-sm text-primary-600">
              The easiest way to create diagrams
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Create Beautiful
            <br />
            Hand-Drawn Diagrams
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A virtual whiteboard for sketching hand-drawn like diagrams. Perfect
            for team collaboration, system design, and creative brainstorming.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2">
              <GithubIcon className="mr-2" /> Star on GitHub
            </button>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#0284c7] to-violet-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=1200"
                alt="Excalidraw Interface"
                width={1200}
                height={675}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create beautiful diagrams and collaborate
              with your team in real-time.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BrushIcon className="h-6 w-6 text-primary-600" />,
                title: "Intuitive Drawing",
                description:
                  "Create beautiful diagrams that look hand-drawn with our intuitive tools and interface. Perfect for wireframes and system designs.",
                color: "primary",
              },
              {
                icon: <UsersIcon className="h-6 w-6 text-emerald-600" />,
                title: "Real-time Collaboration",
                description:
                  "Work together with your team in real-time, seeing changes as they happen. Share and edit diagrams simultaneously.",
                color: "emerald",
              },
              {
                icon: <CodeIcon className="h-6 w-6 text-violet-600" />,
                title: "Developer Friendly",
                description:
                  "Export diagrams as PNG. Integrate with your favorite development tools and workflows.",
                color: "violet",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow"
              >
                <div
                  className={`h-12 w-12 bg-${feature.color}-50 rounded-lg flex items-center justify-center mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">
              © 2025 Excalidraw Clone. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="https://x.com/VinitKumar_01"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://github.com/VinitKumar01/excalidraw"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
