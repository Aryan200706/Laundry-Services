
document.addEventListener("DOMContentLoaded", () => {
    const itemContainers = document.querySelectorAll(".bitems");
    const cartTable = document.querySelector(".stable");
    const totalAmountEl = document.querySelector(".total p");
    const bookForm = document.querySelector(".bf");
    const thankYouMsg = document.getElementById("thankyou-message");

    let cart = [];

  
    itemContainers.forEach(container => {
        const addBtn = container.querySelector(".add");
        const removeBtn = container.querySelector(".remove");
        const nameEl = container.querySelector("h3");
        const priceEl = container.querySelector("p");

        if (!addBtn || !removeBtn || !nameEl || !priceEl) return;

        const serviceName = nameEl.textContent.trim();
        const price = parseFloat(priceEl.textContent.replace("$", "").trim()) || 0;

        addBtn.addEventListener("click", () => {
            
            if (!cart.find(i => i.name === serviceName)) {
                cart.push({ name: serviceName, price });
                renderCart();
            }
            addBtn.style.display = "none";
            removeBtn.style.display = "inline-block";
        });

        removeBtn.addEventListener("click", () => {
            cart = cart.filter(i => i.name !== serviceName);
            renderCart();
            removeBtn.style.display = "none";
            addBtn.style.display = "inline-block";
        });
    });

    
    function renderCart() {
        cartTable.innerHTML = `
            <tr>
                <td>S.No</td>
                <td>Service Name</td>
                <td>Price</td>
            </tr>
        `;

        let totalAmount = 0;
        cart.forEach((item, idx) => {
            totalAmount += item.price;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${idx + 1}</td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
            `;
            cartTable.appendChild(row);
        });

        totalAmountEl.innerText = `$${totalAmount}`;
    }

   
    bookForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!cart.length) {
            alert("Please add services to your cart before booking.");
            return;
        }

        const orderDetails = cart.map(i => `${i.name} - $${i.price}`).join(", ");
        const totalAmount = cart.reduce((s, i) => s + i.price, 0);

      
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
            clearCartAndButtons();
        })
        .catch(err => {
            console.error("EmailJS Error:", err);
            alert("Failed to send confirmation email. Check console for details.");
        });
    });

  
    function clearCartAndButtons() {
        cart = [];
        renderCart();

        itemContainers.forEach(container => {
            const addBtn = container.querySelector(".add-btn");
            const removeBtn = container.querySelector(".remove-btn");
            if (addBtn) addBtn.style.display = "inline-block";
            if (removeBtn) removeBtn.style.display = "none";
        });
    }

    renderCart();
});
