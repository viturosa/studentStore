const socket = io();


socket.on('productsUpdated', (products) => {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.title} - R$ ${p.price}`;
    list.appendChild(li);
  });
});


const form = document.getElementById('product-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => form.reset());
  });
}