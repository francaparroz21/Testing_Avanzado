
const addToCartButtons = document.querySelectorAll('button[data-product-id]');
const cartIdElement = document.getElementById('cartId');
const cartId = cartIdElement.innerText;

addToCartButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const productId = button.getAttribute('data-product-id');

    try {
      const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantity: 1
        })
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Product added to cart');
      } else {
        console.log('Error adding product to cart:', data.error);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  });
});

const buyButton = document.getElementById("buyButton");

buyButton.addEventListener('click', e =>{
    e.preventDefault();

    try {
      fetch(`/api/carts/${cartId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(result=>{
        if(result.status == 200){
          window.location.replace(`/carts/${cartId}`);
        }
      });
    } catch (error) {
      console.log('Error:', error);
    }
});

const socket = io();
const userElement = document.getElementById('userEmail');
const userMail = userElement.innerText;

const chatbox = document.getElementById('chatbox');

socket.emit('authenticated', userMail);

chatbox.addEventListener('keyup', evt =>{
    if(evt.key === "Enter"){
        if(chatbox.value.trim().length>0){
            socket.emit('message', {userMail:userMail, message:chatbox.value.trim()})
            chatbox.value = "";
        }
    }
})

socket.on('messageLogs', data =>{
    if(!userMail) return;

    let log = document.getElementById('messageLogs');
    let messages = "";

    data.forEach(message => {
        messages +=  `${ message.userMail } dice: ${ message.message } <br/>  `       
    });
    log.innerHTML = messages

})

socket.on('newUserConnected', data =>{
    if(!userMail) return;
    Swal.fire({
        toast:true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: "success"
    })
})


