const yearEl = document.getElementById("year");
if (yearEl) yearEl.innerText = new Date().getFullYear();

const formEl = document.querySelector("#contact form");
const nameEl = document.getElementById("nameInput");
const emailEl = document.getElementById("emailInput");
const textEl = document.getElementById("textInput");
const sendBtn = document.getElementById("send-btn");
const msgBoxEl = document.getElementById("msg-box");
const msgCounterEl = document.getElementById("msg-counter");

const showMsg = (text, isError = true) => {
  if (!msgBoxEl) return;
  msgBoxEl.innerText = text;
  msgBoxEl.style.color = isError ? "#f87171" : "#34d399";
};

const counter = () => {
  if (!textEl || !msgCounterEl) return;
  let len = textEl.value.trim().length;
  msgCounterEl.textContent = `${len.toLocaleString()} / 2,000 (min 10)`;
  msgCounterEl.style.color = len > 1800 ? "#f87171" : "#9ca3af";
};

if (formEl) {
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameValue = nameEl ? nameEl.value.trim() : "";
    const emailValue = emailEl ? emailEl.value.trim() : "";
    const textValue = textEl ? textEl.value.trim() : "";

    if (!nameValue) return showMsg("Please add a name");
    if (nameValue.length < 2 || nameValue.length > 80)
      return showMsg("Please enter a valid name");
    if (!/^[\p{L}\s.'-]+$/u.test(nameValue))
      return showMsg("Invalid name format");

    if (!emailValue) return showMsg("Please add an email");
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailValue);
    if (!isValidEmail) return showMsg("Please enter a valid email");

    if (!textValue) return showMsg("Please add a message");
    if (textValue.length < 10 || textValue.length > 2000)
      return showMsg("Must be between 10 and 2000 characters");

    const accessKeyInput = formEl.querySelector('input[name="access_key"]');
    const accessKey = accessKeyInput ? accessKeyInput.value : "";

    if (sendBtn) sendBtn.disabled = true;
    showMsg("Sending...", false);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: nameValue,
          email: emailValue,
          message: textValue,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (nameEl) nameEl.value = "";
        if (emailEl) emailEl.value = "";
        if (textEl) textEl.value = "";
        counter();

        showMsg(result.message || "Message sent successfully!", false);
      } else {
        showMsg(result.message || "Could not send message.", true);
      }
    } catch (err) {
      showMsg("Network error. Please try again.", true);
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  });
}

if (textEl) {
  textEl.addEventListener("input", counter);
  counter();
}
