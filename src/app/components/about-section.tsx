import { motion } from 'motion/react';
import { Instagram, Mail } from 'lucide-react';
import { useState } from 'react';

export function AboutSection() {
  const [emailRevealed, setEmailRevealed] = useState(false);
  const email = ["covet.laurent", "gmail.com"].join("@");

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5]">
      <div className="px-8 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-10 text-5xl leading-[0.85] tracking-tight text-[#2a2a2a] md:text-6xl lg:text-7xl"
          >
            About
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="aspect-[3/4] overflow-hidden"
            >
              <img
                src="https://laurentcovet.com/SRCs/ABOUT/image/LaurentCovet.png"
                alt="Laurent Covet"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col justify-center space-y-5"
            >
              <div className="space-y-3 text-base leading-snug text-[#4a4a4a] md:text-lg">
                <p>
                  Laurent Covet, Director and Creative Technology Supervisor, at the intersection of storytelling and visual exploration.
                </p>

                <p>
                  A multidisciplinary visual craftsman, he has been designing exceptional projects for the luxury sector for over 15 years (commercials, DOOH, immersive experiences), effortlessly blending mastery of the line, aesthetic emotion, and technological audacity.
                </p>

                <p>
                  From visual staging to the design of augmented reality experiences, he brings a holistic vision to every production. A true visual storyteller, he orchestrates creative talents to elevate every shot and bring singular imaginative worlds to life.
                </p>

                <p>
                  Today, the generative medium joins his palette as a new digital clay. While technologies may evolve, the fundamental grammar of the image remains an unbreakable foundation: sketching a concept – shaping the light – composing the frame – igniting emotion.
                </p>

                <p>
                  Driven by this exacting standard, he forges refined narratives where innovation serves no other purpose than to elevate meaning, awaken the senses, and leave a lasting memory.
                </p>
              </div>

              <div className="border-t border-[#d0d0d0] pt-5">
                <h3 className="mb-3 text-xl tracking-tight text-[#2a2a2a] md:text-2xl">
                  Contact
                </h3>
                <div className="space-y-2 text-[#4a4a4a]">
                  {emailRevealed ? (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-[#2a2a2a]"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{email}</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setEmailRevealed(true)}
                      className="inline-flex items-center gap-2 text-[#4a4a4a] transition-colors hover:text-[#2a2a2a]"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Reveal email</span>
                    </button>
                  )}
                </div>
                
                {/* Instagram Link */}
                <div className="mt-4">
                  <a
                    href="https://www.instagram.com/laurentcovet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#4a4a4a] transition-colors hover:text-[#2a2a2a]"
                  >
                    <Instagram className="h-5 w-5" />
                    <span>@laurentcovet</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}