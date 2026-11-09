import express from 'express';

export type Category = {
  id: string;
  name: string;
};

const categories: Category[] = [];

export const getCategory = (id: string) => {
    return categories.find((c) => c.id === id);
}

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json(categories);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const category = categories.find((c) => c.id === id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found!' });
  }

  res.status(200).json(category);
});

router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const newCategory = {
    id: Date.now().toString(),
    name
  };

  categories.push(newCategory);

  res.sendStatus(201).json(newCategory);
});

router.patch('/:id', (req, res) => {
  const { id } = req.body;

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
});

router.delete('/:id', (req, res) => {
  const { id } = req.body;

  const categoryIndex = categories.findIndex((c) => c.id === id);

  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Category not found!' });
  }

  categories.splice(categoryIndex, 1);

  res.status(204).send();
});

export default router;