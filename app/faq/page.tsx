"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"

const faqs = [
  {
    question: "What is MTUCoin?",
    answer: "MTUCoin is a cryptocurrency built on the Solana blockchain, designed for fast and efficient transactions.",
  },
  {
    question: "How do I buy MTUCoin?",
    answer: "You can buy MTUCoin on supported cryptocurrency exchanges or directly through our platform.",
  },
  {
    question: "Is MTUCoin secure?",
    answer: "Yes, MTUCoin uses advanced blockchain technology to ensure the security of transactions and user funds.",
  },
  // Add more FAQs as needed
]

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      <Input
        type="text"
        placeholder="Search FAQs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />
      <Accordion type="single" collapsible className="w-full">
        {filteredFaqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

