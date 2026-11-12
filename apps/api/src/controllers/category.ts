import { Category } from '../models/category';

const categories: Category[] = [];

export  const getCategory = (id: string) => {
  return categories.find((c) => c.id === id);
};

const getCategories = (req: any, res: any) => {
  res.status(200).json(categories);
};

const getCategoryById = (req: any, res: any) => {
  const { id } = req.params;

  const category = categories.find((c) => c.id === id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found!' });
  }

  res.status(200).json(category);
};

const saveCateogry = (req: any, res: any) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const newCategory = {
    id: Date.now().toString(),
    name
  };

  categories.push(newCategory);

  res.status(201).json(newCategory);
};

const editCategory = (req: any, res: any) => {
  const { id } = req.params;

  const categoryIndex = categories.findIndex((c) => c.id === id);

  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Category not found!' });
  }

  let updatedCategory = { ...categories[categoryIndex] };

  const { name } = req.body;

  if (name) {
    updatedCategory.name = name;
  }

  categories[categoryIndex] = updatedCategory;

  res.status(200).json(updatedCategory);
};

const deleteCategory = (req: any, res: any) => {
  const { id } = req.params;

  const categoryIndex = categories.findIndex((c) => c.id === id);

  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Category not found!' });
  }

  categories.splice(categoryIndex, 1);

  res.status(204).send();
};

export default { getCategories, getCategoryById, saveCateogry, editCategory, deleteCategory };
