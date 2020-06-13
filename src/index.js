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

const convertXslBtn = document.getElementById('convertXslBtn');
const convertToXsl = new ConvertToXsl();
convertXslBtn.addEventListener('click', () => {
  const inputText = document.getElementById('editor').innerHTML;
  //console.log(`InputText: ${inputText}`);
  const resultText = document.getElementById('result');
  convertToXsl.initializeTagsCleaner();
  const textConvertedXsl = convertToXsl.showStringConvertedXsl(inputText);
  resultText.innerText = textConvertedXsl;
});
