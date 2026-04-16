(function () {
  const chatBtn = document.createElement("button");
  chatBtn.innerText = "Chat";
  chatBtn.style.position = "fixed";
  chatBtn.style.bottom = "20px";
  chatBtn.style.right = "20px";

  document.body.appendChild(chatBtn);

  chatBtn.onclick = function () {
    const iframe = document.createElement("iframe");
    iframe.src = "https://page-insighter.vercel.app";
    iframe.style.position = "fixed";
    iframe.style.bottom = "80px";
    iframe.style.right = "20px";
    iframe.style.width = "300px";
    iframe.style.height = "400px";

    document.body.appendChild(iframe);
  };
})();
