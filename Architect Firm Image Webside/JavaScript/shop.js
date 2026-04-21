var cart = [];

function ShopPrice() {
  var x = parseInt(document.getElementById("ShopPrice").innerText);
  var y = parseInt(document.getElementById("ShopInput").value);
  var z = x * y;
  document.getElementById("ShopTotal").innerText = z;
}

// 左側欄連結防止重新整理
document.querySelectorAll('.LeftBarcontent a').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
  });
});

// 商品卡片點擊開啟購買視窗
document.querySelectorAll(".MYcardALink").forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    var card = this.querySelector(".MyCardcontainer");
    var imgSrc = card.querySelector("img").src;
    var name = card.querySelector("h4 b").innerText;
    var priceText = card.querySelector("h3 b").innerText;
    var price = priceText.replace("售價$ ", "");

    document.getElementById("ShopModalImg").src = imgSrc;
    document.getElementById("ShopModalName").innerText = name;
    document.getElementById("ShopPrice").innerText = price;
    document.getElementById("ShopInput").value = 0;
    document.getElementById("ShopTotal").innerText = "";

    new bootstrap.Modal(document.getElementById("ShopButton")).show();
  });
});

// 確認送出 → 加入購物車
document
  .querySelector(".modal-footer .ShopButton")
  .addEventListener("click", function () {
    var qty = parseInt(document.getElementById("ShopInput").value);
    if (!qty || qty <= 0) return;

    var name = document.getElementById("ShopModalName").innerText;
    var img = document.getElementById("ShopModalImg").src;
    var price = parseInt(document.getElementById("ShopPrice").innerText);

    var existing = cart.find(function (item) {
      return item.name === name;
    });
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ name: name, img: img, price: price, quantity: qty });
    }

    updateCartIcon();
  });

function checkCartIconVisibility() {
  var icon = document.getElementById("CartIcon");
  if (!icon) return;
  var isCartOpen = document.getElementById("CartOffcanvas").classList.contains("show");
  if (isCartOpen) return;
  icon.style.display = window.scrollY > 550 ? "flex" : "none";
}

window.addEventListener("scroll", checkCartIconVisibility);
window.addEventListener("resize", checkCartIconVisibility);
checkCartIconVisibility();

function updateCartIcon() {
  var badge = document.getElementById("CartBadge");
  var count = cart.length;
  if (count > 0) {
    badge.style.display = "block";
    badge.innerText = count;
  } else {
    badge.style.display = "none";
  }
}

function openCart() {
  renderCart();
  var offcanvasEl = document.getElementById("CartOffcanvas");
  document.getElementById("CartIcon").style.display = "none";
  offcanvasEl.addEventListener("hidden.bs.offcanvas", function () {
    checkCartIconVisibility();
  }, { once: true });
  new bootstrap.Offcanvas(offcanvasEl).show();
}

function renderCart() {
  var list = document.getElementById("CartList");
  if (cart.length === 0) {
    list.innerHTML =
      '<p style="text-align:center; color:#999; margin-top:20px;">購物車是空的</p>';
    document.getElementById("CartTotal").innerText = "0";
    return;
  }

  var total = 0;
  var html = "";
  cart.forEach(function (item, index) {
    var subtotal = item.price * item.quantity;
    total += subtotal;
    html +=
      '<div style="display:flex; align-items:center; margin-bottom:15px; gap:10px;">' +
      '<img src="' +
      item.img +
      '" style="width:60px; height:60px; object-fit:cover; border-radius:5px; flex-shrink:0;">' +
      '<div style="flex:1; min-width:0;">' +
      '<div style="font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
      item.name +
      "</div>" +
      '<div style="color:#888; font-size:13px;">單價: $' +
      item.price +
      " &times; " +
      item.quantity +
      "</div>" +
      '<div style="color:rgb(154,68,68); font-size:13px;">小計: $' +
      subtotal +
      "</div>" +
      "</div>" +
      '<button onclick="removeFromCart(' +
      index +
      ')" style="background:none; border:none; color:#bbb; font-size:18px; cursor:pointer; flex-shrink:0; padding:0 4px; line-height:1;">&#10005;</button>' +
      "</div>";
  });

  list.innerHTML = html;
  document.getElementById("CartTotal").innerText = total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartIcon();
  renderCart();
}
