const deleteProduct = async () => {
  let id = event.target.parentElement.querySelector('[name=productId]').value
  let csrf = event.target.parentElement.querySelector('[name=_csrf]').value
  let productCard = event.target.closest('.card')

  let body = new FormData();
  body.append('productId', id);
  body.append('_csrf', csrf);

  let result = await fetch('/admin/delete-product', {
    method: 'DELETE',
    body: body,
  })
  let data = await result.json();
  console.log(data)
  if (result.status === 200) {

    productCard.parentElement.removeChild(productCard)
  }
}