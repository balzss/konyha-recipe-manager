import type { NextPage } from 'next';
import Link from 'next/link';
import { useRecipes } from '../dataHooks';

const Test: NextPage = () => {
  const { data } = useRecipes();

  return (
    <div>
      <Link href="/">index</Link>
    </div>
  )
};

export default Test;
