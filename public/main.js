function deleteUser(name) {
  console.log('deleteUsercalled');
  console.log(name === ''); 
  fetch('online', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'roomie': name
    })
  })
  .then(res => {
    if (res.ok) return res.json();
  })
  .then(data => {
    console.log(data);
    window.location.reload();
  })
}
