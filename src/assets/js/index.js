import '../styles/index.scss';

function closeError() {
  const error = document.getElementById('error_message');
  const body = document.getElementsByTagName('BODY')[0];
  error.classList.add('hidden');
  setTimeout(() => body.removeChild(error), 700);
}

if (document.getElementById('close')) {
  document.getElementById('close').addEventListener('click', closeError);
}
