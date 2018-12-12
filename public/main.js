var del = document.getElementById('delete');

del.addEventListener('click', function() {
  console.log('delete pressed'); 
  fetch('online', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'roomie': 'roomie'
    })
  })
  .then(res => {
    if (res.ok) return res.json();
  })
  .then(data => {
    console.log(data);
    window.location.reload();
  })
});
