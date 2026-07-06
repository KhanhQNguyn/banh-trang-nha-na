import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { slug } = useParams();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Danh mục: {slug}</h1>
      <p className="mt-2 text-stone-600">Sản phẩm theo danh mục.</p>
    </div>
  );
};

export default CategoryPage;
