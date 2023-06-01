function ShopPrice() {
    var x = parseInt(document.getElementById("ShopPrice").innerText); // 一般屬性使用.innerHTML取值
    var y = parseInt(document.getElementById("ShopInput").value); // input使用.value取值
    var z = x * y;
    document.getElementById("ShopTotal").innerText = z;
}
