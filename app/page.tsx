import Link from 'next/link';
import { BookOpen, CheckCircle, Users, Award, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-zyra rounded-lg flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-zyra bg-clip-text text-transparent">
                  NOOR-E-QURAN
                </h1>
                <p className="text-sm text-gray-600">by Zyra Education</p>
              </div>
            </div>
            <Link href="/admin/login">
              <Button variant="ghost" size="sm">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block bg-gradient-zyra text-white px-4 py-2 rounded-full text-sm font-semibold">
              🎉 LIMITED TIME OFFER - SAVE ₹2,900
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Transform Your Quran Connection in{' '}
              <span className="bg-gradient-zyra bg-clip-text text-transparent">
                27 Days
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              From surface reading to life transformation. Join 4,500+ students who've experienced the Quran like never before.
            </p>

            {/* Pricing */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-primary/20">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-primary">₹999</span>
                <span className="text-2xl text-gray-400 line-through">₹3899</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  SAVE ₹2,900
                </span>
              </div>
              <p className="text-gray-600 text-sm">Special Ramadan Offer • Limited Seats</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="shadow-xl">
                  Enroll Now - ₹999
                </Button>
              </Link>
              <a href="https://wa.me/919913848333" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">
                  WhatsApp Us
                </Button>
              </a>
            </div>

            <p className="text-sm text-gray-500">
              ✅ 7-Day Money-Back Guarantee • ✅ Lifetime Access
            </p>
          </div>

          <div className="relative animate-slide-up">
            <div className="bg-gradient-zyra rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">What's Included</h3>
                <ul className="space-y-3">
                  {[
                    '27 HD Video Lessons',
                    'Complete Digital Coursebook (PDF)',
                    'Interactive Workbook',
                    'Community Forum Access',
                    'Lifetime Access to All Materials',
                    'Daily Quran Reading Guide',
                    'Post-Ramadan Action Plan',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">27-Day Journey Structure</h2>
            <p className="text-lg text-gray-600">
              15-20 minutes daily • Self-paced online learning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                phase: 'Phase 1',
                days: 'Days 1-10',
                title: 'Human Architecture',
                description: 'Character Building & Foundation',
                icon: Users,
              },
              {
                phase: 'Phase 2',
                days: 'Days 11-20',
                title: 'Eternal Vision',
                description: 'Purpose & Values Discovery',
                icon: Star,
              },
              {
                phase: 'Phase 3',
                days: 'Days 21-27',
                title: 'Living Connection',
                description: 'Daily Practice & Integration',
                icon: Clock,
              },
            ].map((phase, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-zyra rounded-lg flex items-center justify-center mb-4">
                  <phase.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-primary font-semibold mb-1">{phase.phase}</div>
                <div className="text-xs text-gray-500 mb-2">{phase.days}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{phase.title}</h3>
                <p className="text-gray-600">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-zyra py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Quran Connection?
          </h2>
          <p className="text-lg text-purple-100 mb-2">
            Limited Time: ₹999 Only <span className="line-through opacity-75">₹3899</span>
          </p>
          <p className="text-md text-purple-200 mb-8">
            Join 4,500+ students • 7-Day Money-Back Guarantee
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="shadow-xl">
              Enroll Now - ₹999
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-bold text-lg mb-3">NOOR-E-QURAN</h3>
              <p className="text-gray-400 text-sm">
                Transform your Quran connection in 27 structured days
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Contact</h3>
              <p className="text-gray-400 text-sm">📧 info@zyraedu.com</p>
              <p className="text-gray-400 text-sm">📱 +91 99138 48333</p>
              <p className="text-gray-400 text-sm">🌐 www.zyraedu.com</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/register" className="block text-gray-400 hover:text-white text-sm">
                  Enroll Now
                </Link>
                <a href="https://wa.me/919913848333" className="block text-gray-400 hover:text-white text-sm" target="_blank" rel="noopener noreferrer">
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 Zyra Education. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
