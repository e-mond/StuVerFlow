import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Sample testimonials data
const testimonials = [
  {
    name: "Micheal Quaye",
    title: "Student, University of Ghana",
    quote: "This platform has made collaboration effortless and enjoyable!",
  },
  {
    name: "Mark Smith",
    title: "Researcher, St. Johns College",
    quote: "I love how easy it is to ask questions and get answers!",
  },
  {
    name: "Sarah Ansah",
    title: "PhD Candidate, Accra Tech Institute",
    quote: "StuVerFlow connects me with people working on similar problems.",
  },
  {
    name: "David Owusu",
    title: "Postdoc, Science Lab",
    quote: "Finding collaborators and resources has never been easier!",
  },
];

// Component: UserExperiences
const UserExperiences = () => {
  const [index, setIndex] = useState(0);

  // Show 2 testimonials at a time
  const visibleTestimonials = testimonials.slice(index, index + 2);

  // Navigate forward
  const next = () => {
    if (index + 2 < testimonials.length) {
      setIndex(index + 1);
    }
  };

  // Navigate backward
  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <section className="bg-gray-200 text-gray-900 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-12 text-left">
          <h2 className="text-3xl font-bold mb-2">User Experiences</h2>
          <p className="text-gray-600">
            StuVerFlow has transformed my academic journey.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
          {visibleTestimonials.map((t, idx) => (
            <div key={idx} className="text-left">
              <div className="flex mb-4 text-black">{"★★★★★"}</div>
              <blockquote className="font-semibold text-lg mb-6">
                “{t.quote}”
              </blockquote>
              {/* User name and title */}
              <div className="text-sm">
                <div className="font-medium">{t.name}</div>
                <div className="text-gray-500">{t.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-between">
          {/* Dots to indicate position */}
          <div className="flex gap-2">
            {Array.from({ length: testimonials.length - 1 }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === index ? "bg-gray-700" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Arrows for navigation */}
          <div className="flex gap-4">
            <button
              onClick={prev}
              disabled={index === 0}
              className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={next}
              disabled={index + 2 >= testimonials.length}
              className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserExperiences;
