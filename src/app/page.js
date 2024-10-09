import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page.</p>
      {/* Link to the Admin page */}
      <Link href="/routers/login/mainpage">
        <p>Go to login</p>
      </Link>
    </div>
  );
}