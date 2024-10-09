import Link from 'next/link';

export default function AdminPage() {
    return (
      <div>
        <h1>Test page</h1>
        <p>This routing works!</p>
        <Link href="/">Go back to homepage</Link>
      </div>
    );
  }