import { Router } from 'express';
import Product from '../../models/Product.js';
import { buildPageLink } from '../../utils/links.js';

const router = Router();


function parseQuery(q) {
  const limit = Math.max(parseInt(q.limit ?? '10', 10), 1);
  const page = Math.max(parseInt(q.page ?? '1', 10), 1);

  
  let sort = undefined;
  if (q.sort === 'asc') sort = { price: 1 };
  if (q.sort === 'desc') sort = { price: -1 };

  
  const filter = {};
  if (q.query) {
    const val = String(q.query).trim();
    if (val.startsWith('category:')) filter.category = val.split(':').slice(1).join(':');
    else if (val.startsWith('status:')) filter.status = val.split(':')[1] === 'true';
    else if (val === 'true' || val === 'false') filter.status = val === 'true';
    else filter.category = val;
  }

  return { limit, page, sort, filter };
}

router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, filter } = parseQuery(req.query);

    const total = await Product.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(page, totalPages);
    const skip = (safePage - 1) * limit;

    const payload = await Product.find(filter)
      .sort(sort || {})
      .skip(skip)
      .limit(limit)
      .lean();

    const hasPrevPage = safePage > 1;
    const hasNextPage = safePage < totalPages;

    const result = {
      status: 'success',
      payload,
      totalPages,
      prevPage: hasPrevPage ? safePage - 1 : null,
      nextPage: hasNextPage ? safePage + 1 : null,
      page: safePage,
      hasPrevPage,
      hasNextPage,
      prevLink: buildPageLink({ req, page: hasPrevPage ? safePage - 1 : null }),
      nextLink: buildPageLink({ req, page: hasNextPage ? safePage + 1 : null }),
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).json({ status: 'error', error: 'Produto não encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (err) {
    res.status(400).json({ status: 'error', error: 'ID inválido' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const created = await Product.create(data);


    const io = req.app.get('io');
    io?.emit('products:updated');

    res.status(201).json({ status: 'success', payload: created });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ status: 'error', error: 'Código (code) já existente' });
    }
    res.status(400).json({ status: 'error', error: err.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const { id, _id, ...update } = req.body; // não permitir atualizar id
    const updated = await Product.findByIdAndUpdate(req.params.pid, update, { new: true });
    if (!updated) return res.status(404).json({ status: 'error', error: 'Produto não encontrado' });

    const io = req.app.get('io');
    io?.emit('products:updated');

    res.json({ status: 'success', payload: updated });
  } catch (err) {
    res.status(400).json({ status: 'error', error: 'ID inválido' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);
    if (!deleted) return res.status(404).json({ status: 'error', error: 'Produto não encontrado' });

    const io = req.app.get('io');
    io?.emit('products:updated');

    res.json({ status: 'success', payload: deleted });
  } catch (err) {
    res.status(400).json({ status: 'error', error: 'ID inválido' });
  }
});

export default router;
