document.addEventListener("DOMContentLoaded", () => {
    const addButtons = document.querySelectorAll("#add"); 
    const cartTable = document.querySelector(".stable");
    const totalAmountEl = document.querySelector(".total p");
    const bookForm = document.querySelector(".bf");
    const thankYouMsg = document.getElementById("thankyou-message");

    let cart = [];

    // Add to cart
    addButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const item = btn.parentElement;
            const serviceName = item.querySelector("h3").innerText.trim();
            const priceText = item.querySelector("p").innerText;
            const price = parseFloat(priceText.replace("$", ""));

            const existing = cart.find(c => c.name === serviceName);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name: serviceName, price: price, qty: 1 });
            }

            renderCart();
        });
    });

    
    function renderCart() {
        cartTable.innerHTML = `
            <tr>
                <td>S.No</td>
                <td>Service Name</td>
                <td>Price</td>
                <td>Quantity</td>
                <td>Subtotal</td>
            </tr>
        `;

        let totalAmount = 0;

        cart.forEach((item, i) => {
            const subtotal = item.price * item.qty;
            totalAmount += subtotal;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>
                    <button class="qty-btn" data-index="${i}" data-action="decrease">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" data-index="${i}" data-action="increase">+</button>
                </td>
                <td>$${subtotal}</td>
            `;
            cartTable.appendChild(row);
        });

        totalAmountEl.innerText = `$${totalAmount}`;

        // Quantity buttons
        const qtyBtns = document.querySelectorAll(".qty-btn");
        qtyBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                const action = btn.getAttribute("data-action");

                if (action === "increase") {
                    cart[index].qty += 1;
                } else if (action === "decrease" && cart[index].qty > 1) {
                    cart[index].qty -= 1;
                } else if (action === "decrease" && cart[index].qty === 1) {
                    cart.splice(index, 1);
                }

                renderCart();
            });
        });
    }

    // Book Now
    bookForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Please add services to your cart before booking.");
            return;
        }

        const orderDetails = cart.map(item => `${item.name} (x${item.qty}) - $${item.price * item.qty}`).join(", ");
        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

        // EmailJS
emailjs.send("service_2uiagsl", "template_7gjqfif", {
    to_name: bookForm.name.value,
    to_email: bookForm.email.value,
    phone: bookForm.phone.value,
    order: orderDetails,
    total: `$${totalAmount}`
})
.then(() => {
    thankYouMsg.style.display = "block";
    bookForm.reset();
    cart = [];
    renderCart();
})
.catch((error) => {
    console.error("EmailJS Error:", error);
    alert("Failed to send confirmation email. Check console for details.");
});


    });
});



