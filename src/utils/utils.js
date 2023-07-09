function renderLoading(
  isLoading,
  btn,
  btnText = "Сохранить",
  loadingText = "Сохранение..."
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = btnText;
  }
}

export function handleFormSubmit(request, evt, loadingText = "Сохранение...") {
  evt.preventDefault();
  const submitBtn = evt.target.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  renderLoading(true, submitBtn, originalText, loadingText);
  request()
    .then(() => {
      evt.target.reset();
    })
    .catch((err) => {
      console.error(`Ошибка: ${err}`);
    })
    .finally(() => {
      renderLoading(false, submitBtn, originalText);
    });
}
