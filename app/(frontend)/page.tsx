import { getPayload } from 'payload';
import config from '@/payload.config';
import { 
  Header, 
  Hero, 
  Services, 
  Principles, 
  About, 
  Steps, 
  Reviews, 
  LeadForm, 
  Footer 
} from '@/components/Sections';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const payload = await getPayload({ config });

  const servicesResult = await payload.find({
    collection: 'services',
    sort: 'createdAt',
    limit: 100,
  });

  const reviewsResult = await payload.find({
    collection: 'reviews',
    sort: '-createdAt',
    limit: 100,
  });

  const dynamicServices = servicesResult.docs.map((service) => ({
    id: String(service.id),
    title: service.title,
    price: service.price,
    numericPrice: service.numericPrice,
    term: service.term,
    desc: service.desc,
    features: Array.isArray(service.features)
      ? service.features.map((f: { item: string }) => f.item)
      : [],
  }));

  const dynamicReviews = reviewsResult.docs.map((review) => ({
    id: review.id,
    author: review.author,
    service: review.service,
    rating: review.rating,
    text: review.text,
  }));

  return (
    <main className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white">
      <Header />
      <Hero />
      <Services services={dynamicServices} />
      <Principles />
      <About />
      <Steps />
      <Reviews reviews={dynamicReviews} />
      <LeadForm />
      <Footer />
    </main>
  );
}