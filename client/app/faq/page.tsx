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
    question: "Is Teleora open source?",
    answer:
      "Yes! Teleora is completely open source. You can view, contribute to, and even self-host the entire codebase on GitHub. We believe in transparency and community-driven development. Feel free to inspect our code, report issues, or submit pull requests to help improve the platform.",
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
    question: "What file types are supported?",
    answer:
      "Teleora supports all file types that Telegram supports. You can upload documents, images, videos, audio files, archives, and more. There are no restrictions on file extensions or formats.",
  },
  {
    question: "Do I need to install Telegram to use Teleora?",
    answer:
      "No, you don't need to have Telegram installed on your device. However, you do need a Telegram account to authenticate and use Teleora. You can create a Telegram account directly from the Telegram website or mobile app.",
  },
  {
    question: "How do I login to Teleora?",
    answer:
      "Teleora offers two convenient login methods: QR Code login (recommended) and phone number login. With QR Code login, simply scan the QR code with your Telegram mobile app. For phone number login, enter your phone number and verification code sent by Telegram.",
  },
  {
    question: "Can I access my files from multiple devices?",
    answer:
      "Yes! Since your files are stored in your Telegram 'Saved Messages', you can access them from any device where you're logged into Teleora. Your files and folder structure are synced across all your devices.",
  },
  {
    question: "What happens to my files if I delete them in Teleora?",
    answer:
      "When you delete a file in Teleora, it is also deleted from your Telegram 'Saved Messages'. However, Telegram files are also stored locally on your devices where you have Telegram installed, so you may still be able to recover them from your local cache.",
  },
  {
    question: "Can I share files with others?",
    answer:
      "Currently, file sharing is not implemented, but it is a feature we are planning to add in the future. You will be able to share files and folders with other Teleora users or generate public links.",
  },
  {
    question: "Is Teleora free to use?",
    answer:
      "Yes, Teleora is completely free to use. There are no premium plans, subscription fees, or hidden costs. We believe in providing free, unlimited cloud storage for everyone.",
  },
  {
    question: "Can I self-host Teleora?",
    answer:
      "Absolutely! Since Teleora is open source, you can download the code from GitHub and host it on your own server. This gives you complete control over your data and allows you to customize the application to your needs.",
  },
  {
    question: "Does Teleora work on mobile devices?",
    answer:
      "Yes, Teleora is fully responsive and works on mobile browsers. You can access your files, upload new ones, and manage your folders from your smartphone or tablet. We're also considering a native mobile app in the future.",
  },
  {
    question: "How fast are uploads and downloads?",
    answer:
      "Upload and download speeds depend on Telegram's servers and your internet connection. Telegram is known for its fast and reliable file transfer speeds, often faster than traditional cloud storage services.",
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-center">
            Frequently Asked Questions
          </h1>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="glass-card-enhanced mb-4 rounded-2xl px-6">
              <AccordionTrigger className="text-md font-semibold hover:no-underline">
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
