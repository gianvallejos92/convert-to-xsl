const cleanTagsBtn = document.getElementById('cleanTagsBtn');
const tagCleaner = new TagsCleaner();
cleanTagsBtn.addEventListener('click', () => {
  const inputText = document.getElementById('editor').innerHTML;
  const resultText = document.getElementById('result');
  tagCleaner.initializeTagsCleaner();
  const textCleaned = tagCleaner.showTagsResult(inputText);
  resultText.innerText = textCleaned;
});

const resetInputBtn = document.getElementById('resetInputBtn');
resetInputBtn.addEventListener('click', () => {
  const inputText = document.getElementById('editor');
  inputText.innerText = '';
  inputText.focus();
});
