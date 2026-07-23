import Link from 'next/link';
import { getAllSettings } from '@/lib/db/settings';
import { getProjects } from '@/lib/db/projects';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { Button } from '@/components/ui/Button';

export default async function HomePage() {
  const settings = await getAllSettings();
  const { projects: featuredProjects } = await getProjects({
    featured: true,
    published: true,
    limit: 6,
  });

  const heroTitle = settings.home_hero_title || "Maria's Portfolio";
  const heroDescription =
    settings.home_hero_description ||
    'A curated collection of 3D modeling and creative work.';
  const aboutSnippet =
    settings.home_about_snippet ||
    "Welcome to my portfolio. I'm a 3D modeler and creative artist with a passion for bringing ideas to life. Each project represents a unique vision and a distinct creative journey.";

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container-page">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-brand-900 leading-tight">
              {heroTitle}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-brand-600 max-w-xl leading-relaxed">
              {heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/projects">
                <Button size="lg">View Projects</Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-16 bg-white/50">
          <div className="container-page">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-brand-900">
                Featured Work
              </h2>
              <Link
                href="/projects"
                className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
              >
                View all &rarr;
              </Link>
            </div>
            <ProjectGrid projects={featuredProjects} />
          </div>
        </section>
      )}

      {/* About Snippet */}
      <section className="py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-brand-900 mb-4">
              About
            </h2>
            <p className="text-brand-600 leading-relaxed mb-6">
              {aboutSnippet}
            </p>
            <Link href="/about">
              <Button variant="secondary">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
