const cleanTagsBtn = document.getElementById('cleanTagsBtn');
const tagCleaner = new TagsCleaner();
cleanTagsBtn.addEventListener('click', () => {
  const inputText = document.getElementById('editor').innerHTML;
  console.log(`HTML: ${inputText}`);
  const resultText = document.getElementById('result');
  tagCleaner.initializeTagsCleaner();
  const textCleaned = tagCleaner.showTagsResult(inputText);
  resultText.innerText = textCleaned;
});

const resetInputBtn = document.getElementById('resetInputBtn');
resetInputBtn.addEventListener('click', () => {
  const inputText = document.getElementById('editor');
  inputText.innerText = '';
  const resultText = document.getElementById('result');
  resultText.innerText = '';
  inputText.focus();
});

const htmlToXslBtn = document.getElementById('htmlToXslBtn');
const htmlToXsl = new HtmlToXsl();
htmlToXslBtn.addEventListener('click', () => {
  const inputText = document.getElementById('editor').innerHTML;
  const resultText = document.getElementById('result');
  htmlToXsl.initializeTagsCleaner();
  const textConvertedXsl = htmlToXsl.showStringHtmlToXsl(inputText);
  resultText.innerText = textConvertedXsl;
});

const disclosureTestBtn = document.getElementById('disclosureTestBtn');
const toDisclosure = new ToDisclosure();
disclosureTestBtn.addEventListener('click', () => {
  const inputText = document.getElementById('editor').innerHTML;
  const resultText = document.getElementById('result');
  toDisclosure.initializeTagsCleaner();
  const textConvertedToDisclosure = toDisclosure.showStringHtmlToXsl(inputText);
  resultText.innerText = textConvertedToDisclosure;
});

