"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Teleora?",
    answer:
      "Teleora is a web application that transforms your Telegram account into a powerful, organized, and unlimited cloud storage solution. It allows you to upload, manage, and access your files with a user-friendly interface, leveraging Telegram's secure and reliable infrastructure.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, your data is as secure as Telegram itself. We use Telegram's official API to store your files in your 'Saved Messages'. We don't have access to your personal chats or data. The authentication is also handled securely through Telegram.",
  },
  {
    question: "Is there a storage limit?",
    answer:
      "No, there is no storage limit. You can upload as many files as you want, as long as each individual file is under Telegram's file size limit (currently 2GB per file).",
  },
  {
    question: "How does file organization work?",
    answer:
      "Teleora provides a folder-based file organization system, which is a feature not available in Telegram's 'Saved Messages'. You can create folders, move files into them, and manage your data in a structured way.",
  },
  {
    question: "Can I share files with others?",
    answer:
      "Currently, file sharing is not implemented, but it is a feature we are planning to add in the future. You will be able to share files and folders with other Teleora users or generate public links.",
  },
  {
    question: "Is Teleora free to use?",
    answer:
      "Yes, Teleora is currently free to use. We may introduce premium features in the future, but the core functionality of unlimited storage will remain free.",
  },
];


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center relative mb-12">
          <div className="absolute left-0">
            <Link href="/" passHref>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-center">
            Frequently Asked Questions
          </h1>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="glass-card-enhanced mb-4 rounded-2xl px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
