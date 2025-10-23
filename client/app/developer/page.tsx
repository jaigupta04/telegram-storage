"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Github, Linkedin, Mail, ExternalLink } from "lucide-react"

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            About the Developer
          </h1>
        </div>

        {/* Developer Profile Card */}
        <Card className="glass-card-enhanced text-white mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#0088cc] to-[#229ed9] p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a1a]">
                    <Image
                      src="/images/profile.jpg"
                      alt="Jai Gupta"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">Jai Gupta</h2>
                <p className="text-xl text-[#229ed9] mb-4">Full Stack Developer</p>
                
                {/* Social Links */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                  <Link 
                    href="https://github.com/jaigupta04" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button 
                      size="sm"
                      variant="outline"
                      className="glass-outline-enhanced px-8 py-4 text-sm text-white bg-transparent rounded-full w-full sm:w-auto"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  </Link>
                  <Link 
                    href="https://linkedin.com/in/jaigupta04" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button 
                      size="sm"
                      variant="outline"
                      className="glass-outline-enhanced px-8 py-4 text-sm text-white bg-transparent rounded-full w-full sm:w-auto"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="glass-outline-enhanced px-8 py-4 text-sm text-white bg-transparent rounded-full w-full sm:w-auto"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Me
                    </Button>
                  </Link>
                </div>

                {/* About Text */}
                <div className="text-gray-300 space-y-4">
                  <p>
                    I'm a passionate full-stack developer with expertise in Vue.js, Node.js, and Firebase. 
                    I created Teleora to transform how developers and users interact with cloud storage, 
                    leveraging Telegram's powerful infrastructure to provide unlimited storage with an 
                    intuitive interface.
                  </p>
                  <p>
                    With a focus on creating intuitive user experiences and efficient code, I enjoy 
                    building tools that solve real problems. Teleora is one such tool that aims to 
                    streamline file management and make cloud storage accessible to everyone.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About This Project */}
        <Card className="glass-card-enhanced text-white mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              About This Project
            </h3>
            <div className="text-gray-300 space-y-4">
              <p>
                Teleora was created to solve a common problem: the need for unlimited, organized cloud storage. 
                While Telegram offers incredible file storage capabilities through "Saved Messages", it lacks 
                the organizational features that users need for effective file management.
              </p>
              <p>
                This project combines Telegram's robust infrastructure with a modern, user-friendly interface 
                that provides folder organization, file management, and seamless access to your data. It's built 
                with performance, usability, and security in mind.
              </p>
              <p>
                The project is built with Vue.js and Firebase, with a focus on performance and reliability. 
                It's designed to be intuitive for beginners while providing powerful features for experienced users.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Technologies Used */}
        <Card className="glass-card-enhanced text-white border-white/10">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-200">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js",
                "React",
                "Node.js",
                "Express",
                "Firebase",
                "Telegram API",
                "JavaScript",
                "Tailwind CSS",
              ].map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 hover:border-[#0088cc]/40 transition-all duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GitHub Link */}
        <div className="mt-8 text-center">
          <Link 
            href="https://github.com/jaigupta04/telegram-storage" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="glass-button-enhanced text-white hover:bg-[#0088cc]/30"
            >
              <Github className="w-5 h-5 mr-2" />
              View Project on GitHub
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
