import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    quote: "StockInsight AI has revolutionized how I stay informed about my investments. The personalized news is spot-on!",
    author: "Sarah J.",
    role: "Individual Investor",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    quote: "As a busy professional, I love getting concise, relevant stock news delivered right to my WhatsApp. It's a game-changer!",
    author: "Michael T.",
    role: "Portfolio Manager",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    quote: "The AI-generated insights have helped me make more informed decisions. It's like having a personal financial analyst.",
    author: "Emily R.",
    role: "Day Trader",
    avatar: "/placeholder.svg?height=40&width=40"
  }
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-gradient-to-b from-slate-100 to-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <p className="text-slate-600 italic mb-4">"{testimonial.quote}"</p>
              </CardContent>
              <CardFooter className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                  <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-800">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

