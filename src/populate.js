import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const products = [
  {
    title: 'Curso Completo de JavaScript',
    description: 'Aprenda JavaScript do básico ao avançado.',
    code: 'JS101',
    price: 199.90,
    status: true,
    stock: 50,
    category: 'Programação',
    thumbnails: ['/images/js-course.jpg']
  },
  {
    title: 'Curso de Node.js e Express',
    description: 'Aprenda a construir APIs REST com Node.js e Express.',
    code: 'NODE202',
    price: 249.90,
    status: true,
    stock: 40,
    category: 'Programação Backend',
    thumbnails: ['/images/node-course.jpg']
  },
  {
    title: 'Curso de React.js',
    description: 'Crie interfaces modernas com React.',
    code: 'REACT303',
    price: 299.90,
    status: true,
    stock: 30,
    category: 'Programação Frontend',
    thumbnails: ['/images/react-course.jpg']
  },
  {
    title: 'Curso de Python para Iniciantes',
    description: 'Aprenda Python do zero com projetos práticos.',
    code: 'PY101',
    price: 179.90,
    status: true,
    stock: 60,
    category: 'Programação',
    thumbnails: ['/images/python-course.jpg']
  },
  {
    title: 'Curso de Fullstack Developer',
    description: 'Aprenda a desenvolver aplicações completas com MERN Stack.',
    code: 'FULLSTACK505',
    price: 399.90,
    status: true,
    stock: 25,
    category: 'Programação Fullstack',
    thumbnails: ['/images/fullstack-course.jpg']
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Conectado ao MongoDB. Populando produtos...');
    await Product.deleteMany({}); // opcional: limpa a coleção antes
    await Product.insertMany(products);
    console.log('Produtos inseridos com sucesso!');
  })
  .catch(err => console.error('Erro ao conectar ou popular:', err))
  .finally(() => mongoose.disconnect());